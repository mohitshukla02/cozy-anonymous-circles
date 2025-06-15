
import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Input } from './ui/input';

interface LocationFilterProps {
  selectedLocation: string | null;
  onLocationChange: (location: string | null) => void;
}

const LocationFilter = ({ selectedLocation, onLocationChange }: LocationFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Mock popular locations - in a real app, this would come from your API
  const popularLocations = [
    'Bangalore, India',
    'Mumbai, India', 
    'Delhi, India',
    'Chennai, India',
    'Pune, India',
    'Kolkata, India',
    'Ahmedabad, India'
  ];

  const filteredLocations = popularLocations.filter(location =>
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationSelect = (location: string) => {
    onLocationChange(location);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onLocationChange(null);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-4 py-2"
        >
          <MapPin size={16} className="mr-2" />
          {selectedLocation || 'Hyderabad, India'}
          <ChevronDown size={16} className="ml-2" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl" align="start">
        <div className="p-4">
          <div className="relative mb-4">
            <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Popular Locations</h3>
            <div className="space-y-1">
              {filteredLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
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
