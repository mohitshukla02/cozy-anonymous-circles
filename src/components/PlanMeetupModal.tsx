
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from '../hooks/use-toast';
import MeetupFormFields from './meetup/MeetupFormFields';
import MeetupFormActions from './meetup/MeetupFormActions';

interface PlanMeetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  onMeetupCreated: (meetupData: {
    title: string;
    description?: string;
    dateTime: string;
    location: string;
    purpose: string;
  }) => void;
}

const PlanMeetupModal = ({ isOpen, onClose, groupId, groupName, onMeetupCreated }: PlanMeetupModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    purpose: 'coffee'
  });
  const [selectedPlace, setSelectedPlace] = useState<{
    city: string;
    region: string;
    coordinates?: { lat: number; lng: number };
  } | undefined>();

  const handleLocationSelect = (location: {
    city: string;
    region: string;
    coordinates?: { lat: number; lng: number };
  }) => {
    setSelectedPlace(location);
    // Use the full description as the location for the meetup
    setFormData(prev => ({ 
      ...prev, 
      location: `${location.city}, ${location.region}` 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      // Call the parent handler with the meetup data
      await onMeetupCreated({
        title: formData.title,
        description: formData.description,
        dateTime: dateTime.toISOString(),
        location: formData.location,
        purpose: formData.purpose
      });

      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        purpose: 'coffee'
      });
      setSelectedPlace(undefined);
    } catch (error) {
      console.error('Error creating meetup:', error);
      toast({
        title: "Error",
        description: "Failed to create meetup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar size={20} />
            Plan Meetup for {groupName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <MeetupFormFields
            formData={formData}
            onFormDataChange={setFormData}
            selectedPlace={selectedPlace}
            onLocationSelect={handleLocationSelect}
          />
          
          <MeetupFormActions
            onCancel={onClose}
            isLoading={isLoading}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanMeetupModal;
