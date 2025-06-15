
import { Meetup } from '@/types/meetup';

export const generateLocalMeetups = (centerLng: number, centerLat: number, cityName: string): Meetup[] => {
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
