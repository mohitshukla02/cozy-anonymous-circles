
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Calendar, Users } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUser } from '@/contexts/UserContext';

interface Meetup {
  id: string;
  title: string;
  groupName: string;
  date: string;
  location: string;
  coordinates: [number, number];
  attendees: number;
}

const MeetupMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [selectedMeetup, setSelectedMeetup] = useState<Meetup | null>(null);
  const { profile } = useUserProfile();
  const { user } = useUser();

  // Generate meetups based on user's location or default to NYC
  const getUserLocation = () => {
    if (profile?.location_coordinates) {
      return {
        center: [profile.location_coordinates.lng, profile.location_coordinates.lat] as [number, number],
        city: profile.location_city || 'Unknown City',
        region: profile.location_region || 'Unknown Region'
      };
    } else if (user?.location?.coordinates) {
      return {
        center: [user.location.coordinates.lng, user.location.coordinates.lat] as [number, number],
        city: user.location.city,
        region: user.location.region
      };
    }
    // Default to NYC if no location is set
    return {
      center: [-73.9665, 40.7829] as [number, number],
      city: 'New York',
      region: 'NY'
    };
  };

  const userLocation = getUserLocation();

  // Generate meetups around user's location
  const generateLocalMeetups = (centerLng: number, centerLat: number, cityName: string): Meetup[] => {
    const meetupTemplates = [
      { title: 'Weekend Photography Walk', groupName: 'Local Photographers', category: 'photography' },
      { title: 'Saturday Morning Hike', groupName: 'Weekend Hikers', category: 'hiking' },
      { title: 'Coffee & Book Discussion', groupName: 'Book Club Enthusiasts', category: 'books' },
      { title: 'Sunset Meetup', groupName: 'Coffee & Conversations', category: 'social' },
      { title: 'Local Art Gallery Tour', groupName: 'Art Enthusiasts', category: 'art' },
      { title: 'Tech Networking Event', groupName: 'Tech Professionals', category: 'tech' }
    ];

    const locations = [
      'Downtown',
      'City Center',
      'Riverside Park',
      'Main Street',
      'Community Center',
      'Local Library'
    ];

    return meetupTemplates.slice(0, 4).map((template, index) => {
      // Generate coordinates within ~5km radius of user location
      const offsetLng = (Math.random() - 0.5) * 0.1; // ~5km radius
      const offsetLat = (Math.random() - 0.5) * 0.1;
      
      const date = new Date();
      date.setDate(date.getDate() + index + 1); // Next few days

      return {
        id: (index + 1).toString(),
        title: template.title,
        groupName: template.groupName,
        date: date.toISOString().split('T')[0],
        location: `${locations[index]}, ${cityName}`,
        coordinates: [centerLng + offsetLng, centerLat + offsetLat] as [number, number],
        attendees: Math.floor(Math.random() * 20) + 5
      };
    });
  };

  const upcomingMeetups = generateLocalMeetups(
    userLocation.center[0], 
    userLocation.center[1], 
    userLocation.city
  );

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
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
        background: #000;
        border: 2px solid white;
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
  }, [mapboxToken, userLocation.center[0], userLocation.center[1]]);

  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('token') as string;
    if (token) {
      setMapboxToken(token);
    }
  };

  if (!mapboxToken) {
    return (
      <div className="border border-gray-200 rounded-2xl p-8">
        <div className="text-center max-w-md mx-auto">
          <MapPin className="mx-auto text-gray-400 mb-4" size={32} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Explore meetups in {userLocation.city}
          </h3>
          <p className="text-gray-600 mb-6">
            Enter your Mapbox token to see upcoming events on the map
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <input
              type="text"
              name="token"
              placeholder="Mapbox public token"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              required
            />
            <button 
              type="submit" 
              className="w-full bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Load map
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            Get your token at{' '}
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Meetups in {userLocation.city}
        </h2>
        <p className="text-gray-600">{upcomingMeetups.length} events happening this week</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="relative h-96 rounded-xl overflow-hidden border border-gray-200">
            <div ref={mapContainer} className="absolute inset-0" />
          </div>
        </div>
        
        {/* Meetup List */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">This week's events</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {upcomingMeetups.map((meetup) => (
              <div
                key={meetup.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedMeetup?.id === meetup.id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedMeetup(meetup)}
              >
                <h4 className="font-medium text-gray-900 mb-1">{meetup.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{meetup.groupName}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{new Date(meetup.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{meetup.attendees}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Meetup Details */}
      {selectedMeetup && (
        <div className="mt-6 p-6 border border-gray-200 rounded-xl bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">{selectedMeetup.title}</h4>
              <p className="text-gray-600 mb-4">{selectedMeetup.groupName}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(selectedMeetup.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{selectedMeetup.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{selectedMeetup.attendees} attending</span>
                </div>
              </div>
            </div>
            <button className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Join event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetupMap;
