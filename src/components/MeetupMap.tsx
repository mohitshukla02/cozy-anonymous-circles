
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserLocation } from '@/hooks/useUserLocation';
import { generateLocalMeetups } from '@/utils/meetupGenerator';
import { Meetup } from '@/types/meetup';
import MapboxTokenForm from '@/components/meetup/MapboxTokenForm';
import MapMeetupList from '@/components/meetup/MapMeetupList';
import SelectedMeetupDetails from '@/components/meetup/SelectedMeetupDetails';

const MeetupMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [selectedMeetup, setSelectedMeetup] = useState<Meetup | null>(null);
  const { effectiveTheme } = useTheme();
  const userLocation = useUserLocation();

  // Check for stored token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('mapboxToken');
    if (storedToken) {
      setMapboxToken(storedToken);
    }
  }, []);

  const upcomingMeetups = generateLocalMeetups(
    userLocation.center[0], 
    userLocation.center[1], 
    userLocation.city
  );

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
    // Store token in localStorage for persistence
    localStorage.setItem('mapboxToken', token);
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    // Choose map style based on theme
    const mapStyle = effectiveTheme === 'dark' 
      ? 'mapbox://styles/mapbox/dark-v11' 
      : 'mapbox://styles/mapbox/light-v11';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: userLocation.center,
      zoom: 12, // Closer zoom for city-level view
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add meetup markers
    upcomingMeetups.forEach((meetup) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'meetup-marker';
      markerElement.style.cssText = `
        width: 32px;
        height: 32px;
        background: ${effectiveTheme === 'dark' ? '#fafafa' : '#171717'};
        border: 2px solid ${effectiveTheme === 'dark' ? '#171717' : '#fafafa'};
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      const icon = document.createElement('div');
      icon.innerHTML = '📍';
      icon.style.fontSize = '14px';
      markerElement.appendChild(icon);

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(meetup.coordinates)
        .addTo(map.current!);

      // Add click event to marker
      markerElement.addEventListener('click', () => {
        setSelectedMeetup(meetup);
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, userLocation.center[0], userLocation.center[1], effectiveTheme]);

  if (!mapboxToken) {
    return <MapboxTokenForm userLocationCity={userLocation.city} onTokenSubmit={handleTokenSubmit} />;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Meetups in {userLocation.city}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">{upcomingMeetups.length} events happening this week</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="relative h-96 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
            <div ref={mapContainer} className="absolute inset-0" />
          </div>
        </div>
        
        {/* Meetup List */}
        <MapMeetupList 
          meetups={upcomingMeetups}
          selectedMeetup={selectedMeetup}
          onMeetupSelect={setSelectedMeetup}
        />
      </div>

      {/* Selected Meetup Details */}
      {selectedMeetup && <SelectedMeetupDetails meetup={selectedMeetup} />}
    </div>
  );
};

export default MeetupMap;
