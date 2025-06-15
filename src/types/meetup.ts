
export interface Meetup {
  id: string;
  title: string;
  groupName: string;
  date: string;
  location: string;
  coordinates: [number, number];
  attendees: number;
}

export interface UserLocation {
  center: [number, number];
  city: string;
  region: string;
}
