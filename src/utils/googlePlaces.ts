
interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export class GooglePlacesService {
  private supabaseClient: any;

  constructor(supabaseClient: any) {
    this.supabaseClient = supabaseClient;
  }

  async searchPlaces(query: string): Promise<PlacePrediction[]> {
    try {
      const { data, error } = await this.supabaseClient.functions.invoke('google-places', {
        body: { 
          action: 'autocomplete',
          input: query 
        }
      });

      if (error) {
        console.error('Error calling google-places function:', error);
        return [];
      }

      return data?.predictions || [];
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const { data, error } = await this.supabaseClient.functions.invoke('google-places', {
        body: { 
          action: 'details',
          place_id: placeId 
        }
      });

      if (error) {
        console.error('Error calling google-places function:', error);
        return null;
      }

      return data?.result || null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  extractLocationFromPlace(place: PlaceDetails): {
    city: string;
    region: string;
    coordinates: { lat: number; lng: number };
  } {
    let city = '';
    let region = '';

    // Extract city and region from address components
    place.address_components.forEach(component => {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        region = component.long_name;
      } else if (component.types.includes('sublocality_level_1') && !city) {
        city = component.long_name;
      }
    });

    // Fallback to formatted address parsing if components don't provide clear city/region
    if (!city || !region) {
      const addressParts = place.formatted_address.split(', ');
      if (addressParts.length >= 2) {
        city = city || addressParts[0];
        region = region || addressParts[addressParts.length - 2];
      }
    }

    return {
      city: city || 'Unknown City',
      region: region || 'Unknown Region',
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      }
    };
  }
}
