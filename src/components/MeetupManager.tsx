
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import { createMeetup, rsvpToMeetup, checkInToMeetup } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';

interface MeetupManagerProps {
  groupId: string;
  groupName: string;
  isLocalGroup: boolean;
  meetupDeadline?: string;
  groupStatus: 'active' | 'warning' | 'final_warning' | 'archived';
}

const MeetupManager: React.FC<MeetupManagerProps> = ({
  groupId,
  groupName,
  isLocalGroup,
  meetupDeadline,
  groupStatus
}) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [showCreateMeetup, setShowCreateMeetup] = useState(false);
  const [meetupForm, setMeetupForm] = useState({
    title: '',
    description: '',
    dateTime: '',
    location: ''
  });
  const [meetups, setMeetups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const daysUntilDeadline = meetupDeadline 
    ? Math.ceil((new Date(meetupDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const getStatusMessage = () => {
    if (!isLocalGroup) return null;
    
    switch (groupStatus) {
      case 'warning':
        return {
          message: "Your group is building great connections - time to plan a meetup?",
          variant: 'default' as const,
          icon: <Clock className="w-4 h-4" />
        };
      case 'final_warning':
        return {
          message: `This group will be archived in ${daysUntilDeadline} days without a scheduled meetup!`,
          variant: 'destructive' as const,
          icon: <AlertTriangle className="w-4 h-4" />
        };
      default:
        return null;
    }
  };

  const handleCreateMeetup = async () => {
    if (!user?.username || !meetupForm.title || !meetupForm.dateTime || !meetupForm.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const success = await createMeetup({
        groupId,
        title: meetupForm.title,
        description: meetupForm.description,
        dateTime: meetupForm.dateTime,
        location: meetupForm.location,
        createdBy: user.username
      });

      if (success) {
        toast({
          title: "Meetup created!",
          description: "Group members can now RSVP to your meetup"
        });
        setShowCreateMeetup(false);
        setMeetupForm({ title: '', description: '', dateTime: '', location: '' });
        loadMeetups();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create meetup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (meetupId: string, status: 'interested' | 'attending' | 'not_attending') => {
    if (!user?.username) return;

    try {
      const success = await rsvpToMeetup(meetupId, user.username, status);
      if (success) {
        toast({
          title: "RSVP updated!",
          description: `You're now marked as ${status}`
        });
        loadMeetups();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update RSVP",
        variant: "destructive"
      });
    }
  };

  const handleCheckIn = async (meetupId: string) => {
    if (!user?.username) return;

    try {
      const success = await checkInToMeetup(meetupId, user.username);
      if (success) {
        toast({
          title: "Checked in!",
          description: "Thanks for confirming your attendance"
        });
        loadMeetups();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check in",
        variant: "destructive"
      });
    }
  };

  const loadMeetups = async () => {
    // This would load meetups from Supabase
    // For now, we'll use empty array
    setMeetups([]);
  };

  useEffect(() => {
    loadMeetups();
  }, [groupId]);

  const statusAlert = getStatusMessage();

  return (
    <div className="space-y-4">
      {/* Status Alert for Local Groups */}
      {statusAlert && (
        <Card className={`border-l-4 ${
          statusAlert.variant === 'destructive' 
            ? 'border-l-red-500 bg-red-50' 
            : 'border-l-yellow-500 bg-yellow-50'
        }`}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              {statusAlert.icon}
              <p className={`text-sm font-medium ${
                statusAlert.variant === 'destructive' ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {statusAlert.message}
              </p>
            </div>
            {daysUntilDeadline !== null && (
              <p className="text-xs mt-1 text-gray-600">
                Days remaining: {daysUntilDeadline}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Meetup Section */}
      {isLocalGroup && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Plan a Meetup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Keep your group active by organizing in-person meetups. This resets your group's 4-week timer!
            </p>
            
            <Dialog open={showCreateMeetup} onOpenChange={setShowCreateMeetup}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Plan New Meetup
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Meetup for {groupName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      value={meetupForm.title}
                      onChange={(e) => setMeetupForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Coffee meetup at Central Park"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Date & Time *</label>
                    <Input
                      type="datetime-local"
                      value={meetupForm.dateTime}
                      onChange={(e) => setMeetupForm(prev => ({ ...prev, dateTime: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Location *</label>
                    <Input
                      value={meetupForm.location}
                      onChange={(e) => setMeetupForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Starbucks, 123 Main St (public spaces only)"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={meetupForm.description}
                      onChange={(e) => setMeetupForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Let's grab coffee and chat about photography tips!"
                      rows={3}
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800">Safety Guidelines</h4>
                    <ul className="text-xs text-blue-700 mt-1 space-y-1">
                      <li>• Always meet in public spaces</li>
                      <li>• Share location with a friend</li>
                      <li>• Consider daytime meetups initially</li>
                    </ul>
                  </div>
                  
                  <Button
                    onClick={handleCreateMeetup}
                    disabled={loading || !meetupForm.title || !meetupForm.dateTime || !meetupForm.location}
                    className="w-full"
                  >
                    {loading ? 'Creating...' : 'Create Meetup'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Meetups */}
      {meetups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Upcoming Meetups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {meetups.map((meetup) => (
                <div key={meetup.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{meetup.title}</h4>
                    <Badge
                      variant={meetup.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {meetup.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(meetup.date_time).toLocaleDateString()} at{' '}
                      {new Date(meetup.date_time).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {meetup.location}
                    </div>
                  </div>
                  
                  {meetup.description && (
                    <p className="text-sm text-gray-700 mt-2">{meetup.description}</p>
                  )}
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRSVP(meetup.id, 'attending')}
                    >
                      Attending
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRSVP(meetup.id, 'interested')}
                    >
                      Interested
                    </Button>
                    {meetup.status === 'planned' && (
                      <Button
                        size="sm"
                        onClick={() => handleCheckIn(meetup.id)}
                        className="ml-auto"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Check In
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Group Timer Info */}
      {isLocalGroup && daysUntilDeadline !== null && (
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{daysUntilDeadline}</div>
              <div className="text-sm text-gray-600">days until auto-archive</div>
              <div className="text-xs text-gray-500 mt-1">
                Schedule a meetup to reset the timer
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeetupManager;
