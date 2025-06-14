
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Calendar, Users, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

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

  // Mock upcoming meetups data - in a real app, this would come from your backend
  const upcomingMeetups: Meetup[] = [
    {
      id: '1',
      title: 'Weekend Photography Walk',
      groupName: 'Local Photographers',
      date: '2024-06-16',
      location: 'Central Park',
      coordinates: [-73.9665, 40.7829], // Central Park NYC coordinates
      attendees: 12
    },
    {
      id: '2',
      title: 'Saturday Morning Hike',
      groupName: 'Weekend Hikers',
      date: '2024-06-17',
      location: 'Prospect Park',
      coordinates: [-73.9690, 40.6602], // Prospect Park coordinates
      attendees: 8
    },
    {
      id: '3',
      title: 'Coffee & Book Discussion',
      groupName: 'Book Club Enthusiasts',
      date: '2024-06-18',
      location: 'Brooklyn Heights',
      coordinates: [-73.9969, 40.6955], // Brooklyn Heights coordinates
      attendees: 15
    },
    {
      id: '4',
      title: 'Sunset Meetup',
      groupName: 'Coffee & Conversations',
      date: '2024-06-19',
      location: 'Williamsburg',
      coordinates: [-73.9442, 40.7081], // Williamsburg coordinates
      attendees: 20
    }
  ];

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-73.9665, 40.7829], // Centered on NYC
      zoom: 11,
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
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      const icon = document.createElement('div');
      icon.innerHTML = '📍';
      icon.style.fontSize = '12px';
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
  }, [mapboxToken]);

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
      <Card className="p-6">
        <div className="text-center">
          <MapPin className="mx-auto text-amber-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Explore Local Meetups</h3>
          <p className="text-gray-600 mb-4">
            Enter your Mapbox token to see upcoming meetups in your city
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <input
              type="text"
              name="token"
              placeholder="Enter your Mapbox public token"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              Load Map
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Get your token at{' '}
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
              mapbox.com
            </a>
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="text-amber-600" size={24} />
          <h3 className="text-xl font-semibold text-gray-800">Upcoming Meetups Near You</h3>
        </div>
        <span className="text-sm text-gray-500">{upcomingMeetups.length} events this week</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="relative h-80 rounded-xl overflow-hidden border border-gray-200">
            <div ref={mapContainer} className="absolute inset-0" />
          </div>
        </div>
        
        {/* Meetup List */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">This Week's Events</h4>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {upcomingMeetups.map((meetup) => (
              <div
                key={meetup.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedMeetup?.id === meetup.id
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMeetup(meetup)}
              >
                <h5 className="font-medium text-sm text-gray-800 mb-1">{meetup.title}</h5>
                <p className="text-xs text-gray-600 mb-2">{meetup.groupName}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{new Date(meetup.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
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
        <Card className="p-4 border-amber-200 bg-amber-50">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">{selectedMeetup.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{selectedMeetup.groupName}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{new Date(selectedMeetup.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>{selectedMeetup.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={14} />
                  <span>{selectedMeetup.attendees} attending</span>
                </div>
              </div>
            </div>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
              <ExternalLink size={14} className="mr-1" />
              View Details
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MeetupMap;
