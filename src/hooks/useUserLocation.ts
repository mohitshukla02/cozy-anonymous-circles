
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUser } from '@/contexts/UserContext';
import { UserLocation } from '@/types/meetup';

export const useUserLocation = (): UserLocation => {
  const { profile } = useUserProfile();
  const { user } = useUser();

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
  
  // Default to Hyderabad instead of NYC
  return {
    center: [78.4867, 17.3850] as [number, number],
    city: 'Hyderabad',
    region: 'Telangana'
  };
};
