
import React, { useState } from 'react';
import { MapPin, Loader, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import GooglePlacesSelector from './GooglePlacesSelector';
import { useGooglePlaces } from '@/hooks/useGooglePlaces';

interface LocationSelectorProps {
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

const LocationSelector = ({ onLocationSelect, selectedLocation }: LocationSelectorProps) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualCity, setManualCity] = useState('');
  const [manualRegion, setManualRegion] = useState('');
  const [error, setError] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);

  const { isReady } = useGooglePlaces();

  // If Google Places is available, use the enhanced selector
  if (isReady) {
    return <GooglePlacesSelector onLocationSelect={onLocationSelect} selectedLocation={selectedLocation} />;
  }

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
          
          // Use a reverse geocoding service (here we'll simulate it)
          // In a real app, you'd use Google Maps API, OpenStreetMap, etc.
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
          } else {
            throw new Error('Failed to get location details');
          }
        } catch (error) {
          setError('Failed to determine your location. Please enter manually.');
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setError('Location access denied. Please enter your city manually.');
        setIsDetecting(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const handleManualSubmit = () => {
    if (manualCity.trim() && manualRegion.trim()) {
      onLocationSelect({
        city: manualCity.trim(),
        region: manualRegion.trim()
      });
      setManualCity('');
      setManualRegion('');
      setError('');
    }
  };

  return (
    <div className="space-y-4">
      {selectedLocation ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm text-green-800">
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

          <div className="text-center text-sm text-gray-500">or</div>

          {!showManualEntry ? (
            <div className="text-center">
              <Button
                onClick={() => setShowManualEntry(true)}
                variant="outline"
                className="w-full"
              >
                Enter Location Manually
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                placeholder="Enter your city"
                className="text-sm"
              />
              <Input
                value={manualRegion}
                onChange={(e) => setManualRegion(e.target.value)}
                placeholder="Enter your state/region"
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleManualSubmit}
                  disabled={!manualCity.trim() || !manualRegion.trim()}
                  className="flex-1"
                >
                  Set Location
                </Button>
                <Button
                  onClick={() => setShowManualEntry(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-xs text-amber-700">
          Your location helps us show you local meetup groups in your area. We only store city-level information for privacy.
        </p>
      </div>
    </div>
  );
};

export default LocationSelector;
