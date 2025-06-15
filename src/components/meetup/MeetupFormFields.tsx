
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import GooglePlacesSelector from '../GooglePlacesSelector';
import PurposeSelector from './PurposeSelector';

interface MeetupFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  purpose: string;
}

interface MeetupFormFieldsProps {
  formData: MeetupFormData;
  onFormDataChange: (formData: MeetupFormData) => void;
  selectedPlace?: {
    city: string;
    region: string;
    coordinates?: { lat: number; lng: number };
  };
  onLocationSelect: (location: {
    city: string;
    region: string;
    coordinates?: { lat: number; lng: number };
  }) => void;
}

const MeetupFormFields = ({ 
  formData, 
  onFormDataChange, 
  selectedPlace, 
  onLocationSelect 
}: MeetupFormFieldsProps) => {
  const updateFormData = (field: keyof MeetupFormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <>
      <div>
        <Label htmlFor="title">Meetup Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData('title', e.target.value)}
          placeholder="e.g., Coffee & Chat"
          maxLength={100}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="What will you do at this meetup?"
          rows={3}
          maxLength={300}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => updateFormData('date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => updateFormData('time', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Location *</Label>
        <GooglePlacesSelector
          onLocationSelect={onLocationSelect}
          selectedLocation={selectedPlace}
        />
      </div>

      <PurposeSelector
        value={formData.purpose}
        onChange={(value) => updateFormData('purpose', value)}
      />
    </>
  );
};

export default MeetupFormFields;
