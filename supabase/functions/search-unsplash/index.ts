
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
    const { query, per_page = 20 } = await req.json()
    
    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const unsplashAccessKey = Deno.env.get('UNSPLASH_ACCESS_KEY')
    
    if (!unsplashAccessKey) {
      console.error('UNSPLASH_ACCESS_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ error: 'Unsplash API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${per_page}`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashAccessKey}`,
          'Accept-Version': 'v1'
        }
      }
    )

    if (!response.ok) {
      console.error('Unsplash API error:', response.status, response.statusText)
      return new Response(
        JSON.stringify({ error: 'Failed to search Unsplash images' }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const data = await response.json()
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in search-unsplash function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
