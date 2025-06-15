
import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface LocationFilterProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const LocationFilter = ({ selectedLocation, onLocationChange }: LocationFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(selectedLocation);

  const handleApplyLocation = () => {
    onLocationChange(inputValue);
    setIsOpen(false);
  };

  const handleClearLocation = () => {
    setInputValue('');
    onLocationChange('');
    setIsOpen(false);
  };

  const popularLocations = [
    'Hyderabad, India',
    'Bangalore, India',
    'Mumbai, India',
    'Delhi, India',
    'Chennai, India',
    'Pune, India',
    'Kolkata, India',
    'Ahmedabad, India'
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full px-4 py-2 h-auto border-gray-300 hover:border-gray-400 transition-colors"
        >
          <MapPin size={16} className="mr-2 text-gray-500" />
          <span className="text-sm font-medium">
            {selectedLocation || 'All Locations'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Filter by Location</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search for a city..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Popular Locations</h4>
            <div className="grid grid-cols-1 gap-1">
              {popularLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => setInputValue(location)}
                  className="text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearLocation}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              onClick={handleApplyLocation}
              size="sm"
              className="flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LocationFilter;
