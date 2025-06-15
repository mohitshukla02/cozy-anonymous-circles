
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle, Heart, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';

interface MeetupCardProps {
  meetup: {
    id: string;
    title: string;
    description?: string;
    dateTime: string;
    location: string;
    purpose: string;
    status: 'planned' | 'successful' | 'failed' | 'cancelled';
    rsvpCount: number;
    checkinCount: number;
    createdBy: string;
  };
  currentUserId: string;
  userRsvpStatus?: 'attending' | 'not_attending' | 'suggest_new_time';
  userCheckedIn?: boolean;
  onRsvp: (status: 'attending' | 'not_attending' | 'suggest_new_time') => void;
  onCheckIn: () => void;
  canCheckIn: boolean;
}

const MeetupCard = ({ meetup, currentUserId, userRsvpStatus, userCheckedIn, onRsvp, onCheckIn, canCheckIn }: MeetupCardProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const meetupDate = new Date(meetup.dateTime);
  const now = new Date();
  const isPast = meetupDate < now;
  const isToday = meetupDate.toDateString() === now.toDateString();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleRsvp = async (status: 'attending' | 'not_attending' | 'suggest_new_time') => {
    setIsLoading(true);
    try {
      onRsvp(status);
      const statusText = status === 'attending' ? 'attending' : status === 'not_attending' ? 'not attending' : 'suggesting new time';
      toast({
        title: "RSVP Updated",
        description: `You're now marked as ${statusText}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update RSVP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      onCheckIn();
      toast({
        title: "Checked In!",
        description: "You're now checked in to this meetup"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check in",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (meetup.status) {
      case 'successful':
        return <Badge className="bg-green-100 text-green-800">Successful</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">{meetup.title}</h3>
            {meetup.description && (
              <p className="text-sm text-gray-600 mb-3">{meetup.description}</p>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={14} />
                <span>{formatDate(meetupDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={14} />
                <span>{formatTime(meetupDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} />
                <span>{meetup.location}</span>
              </div>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Heart size={14} />
              <span>{meetup.rsvpCount} attending</span>
            </div>
            {meetup.status === 'successful' && (
              <div className="flex items-center gap-1">
                <CheckCircle size={14} />
                <span>{meetup.checkinCount} checked in</span>
              </div>
            )}
          </div>
          
          {meetup.rsvpCount < 3 && meetup.status === 'planned' && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Need {3 - meetup.rsvpCount} more to confirm
            </Badge>
          )}
        </div>

        {/* RSVP Actions */}
        {!isPast && meetup.status === 'planned' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant={userRsvpStatus === 'attending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleRsvp('attending')}
                disabled={isLoading}
                className="flex-1"
              >
                Count me in
              </Button>
              <Button
                variant={userRsvpStatus === 'not_attending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleRsvp('not_attending')}
                disabled={isLoading}
                className="flex-1"
              >
                Can't make it
              </Button>
            </div>
            
            <Button
              variant={userRsvpStatus === 'suggest_new_time' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleRsvp('suggest_new_time')}
              disabled={isLoading}
              className="w-full text-xs"
            >
              Suggest new time
            </Button>
          </div>
        )}

        {/* Check-in Action */}
        {canCheckIn && isToday && !userCheckedIn && userRsvpStatus === 'attending' && (
          <Button
            onClick={handleCheckIn}
            disabled={isLoading}
            className="w-full"
          >
            <CheckCircle size={16} className="mr-2" />
            Check In Now
          </Button>
        )}

        {userCheckedIn && (
          <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-lg py-2">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">You're checked in!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetupCard;
