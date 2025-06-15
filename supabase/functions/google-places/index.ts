
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, input, place_id } = await req.json()
    
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Google Places API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    let url = ''
    
    if (action === 'autocomplete') {
      if (!input) {
        return new Response(
          JSON.stringify({ error: 'Input is required for autocomplete' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&types=(cities)&key=${apiKey}`
    } else if (action === 'details') {
      if (!place_id) {
        return new Response(
          JSON.stringify({ error: 'Place ID is required for details' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=place_id,formatted_address,name,geometry,address_components&key=${apiKey}`
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Use "autocomplete" or "details"' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Google Places API returned ${response.status}`)
    }

    const data = await response.json()
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`)
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in google-places function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
