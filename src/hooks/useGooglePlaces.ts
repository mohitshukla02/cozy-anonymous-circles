
import { useState, useEffect } from 'react';
import { GooglePlacesService } from '@/utils/googlePlaces';
import { supabase } from '@/integrations/supabase/client';

interface PlaceSuggestion {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
}

export const useGooglePlaces = () => {
  const [placesService, setPlacesService] = useState<GooglePlacesService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the service with the supabase client
    setPlacesService(new GooglePlacesService(supabase));
  }, []);

  const searchPlaces = async (query: string): Promise<PlaceSuggestion[]> => {
    if (!placesService || !query.trim()) return [];

    setIsLoading(true);
    setError(null);

    try {
      const predictions = await placesService.searchPlaces(query);
      return predictions.map(prediction => ({
        place_id: prediction.place_id,
        description: prediction.description,
        main_text: prediction.structured_formatting.main_text,
        secondary_text: prediction.structured_formatting.secondary_text
      }));
    } catch (err) {
      console.error('Error searching places:', err);
      setError('Failed to search places');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationFromPlaceId = async (placeId: string) => {
    if (!placesService) return null;

    setIsLoading(true);
    setError(null);

    try {
      const placeDetails = await placesService.getPlaceDetails(placeId);
      if (placeDetails) {
        return placesService.extractLocationFromPlace(placeDetails);
      }
      return null;
    } catch (err) {
      console.error('Error getting place details:', err);
      setError('Failed to get place details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchPlaces,
    getLocationFromPlaceId,
    isLoading,
    error,
    isReady: !!placesService
  };
};
