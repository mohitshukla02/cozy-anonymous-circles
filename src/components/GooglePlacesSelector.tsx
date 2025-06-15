
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader, CheckCircle, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useGooglePlaces } from '@/hooks/useGooglePlaces';

interface GooglePlacesSelectorProps {
  onLocationSelect: (location: {
    city: string;
    region: string;
    coordinates?: { lat: number; lng: number };
  }) => void;
  selectedLocation?: {
    city: string;
    region: string;
    coordinates?: { lat: number; lng: number };
  };
}

interface PlaceSuggestion {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
}

const GooglePlacesSelector = ({ onLocationSelect, selectedLocation }: GooglePlacesSelectorProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState('');
  
  const { searchPlaces, getLocationFromPlaceId, isLoading, error: placesError, isReady } = useGooglePlaces();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (placesError) {
      setError(placesError);
    }
  }, [placesError]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        suggestionsRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setError('');

    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!isReady) {
      setError('Google Places service not ready');
      return;
    }

    try {
      const results = await searchPlaces(searchQuery);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch (err) {
      setError('Failed to search locations');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = async (suggestion: PlaceSuggestion) => {
    setQuery(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);

    const location = await getLocationFromPlaceId(suggestion.place_id);
    if (location) {
      onLocationSelect(location);
      setError('');
    } else {
      setError('Failed to get location details');
    }
  };

  const detectLocation = async () => {
    setIsDetecting(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use a reverse geocoding service as fallback
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            const location = {
              city: data.city || data.locality || 'Unknown City',
              region: data.principalSubdivision || data.countryName || 'Unknown Region',
              coordinates: { lat: latitude, lng: longitude }
            };
            onLocationSelect(location);
            setQuery(`${location.city}, ${location.region}`);
          } else {
            throw new Error('Failed to get location details');
          }
        } catch (error) {
          setError('Failed to determine your location. Please search manually.');
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setError('Location access denied. Please search for your city manually.');
        setIsDetecting(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <div className="space-y-4">
      {selectedLocation ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-800 dark:text-green-200">
            Location set: {selectedLocation.city}, {selectedLocation.region}
          </span>
        </div>
      ) : (
        <>
          <div className="text-center">
            <Button
              onClick={detectLocation}
              disabled={isDetecting}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              {isDetecting ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <MapPin size={16} />
              )}
              {isDetecting ? 'Detecting...' : 'Use My Current Location'}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">or</div>

          <div className="relative">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search for your city..."
                className="pl-10 text-sm"
                disabled={!isReady}
              />
              {isLoading && (
                <Loader size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-gray-400" />
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {suggestion.main_text}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {suggestion.secondary_text}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Your location helps us show you local meetup groups in your area. We only store city-level information for privacy.
        </p>
      </div>
    </div>
  );
};

export default GooglePlacesSelector;
