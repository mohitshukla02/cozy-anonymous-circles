
import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface LocationFilterProps {
  selectedLocation: string | null;
  onLocationChange: (location: string | null) => void;
}

const LocationFilter = ({ selectedLocation, onLocationChange }: LocationFilterProps) => {
  const popularLocations = [
    'Hyderabad, India',
    'Mumbai, India', 
    'Delhi, India',
    'Bangalore, India',
    'Chennai, India',
    'Pune, India'
  ];

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Location:</span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300"
          >
            {selectedLocation || 'All locations'}
            <ChevronDown size={14} className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DropdownMenuItem 
            onClick={() => onLocationChange(null)}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
          >
            All locations
          </DropdownMenuItem>
          {popularLocations.map((location) => (
            <DropdownMenuItem 
              key={location}
              onClick={() => onLocationChange(location)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
            >
              {location}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedLocation && (
        <Badge 
          variant="secondary" 
          className="cursor-pointer dark:bg-gray-700 dark:text-gray-300"
          onClick={() => onLocationChange(null)}
        >
          {selectedLocation} ×
        </Badge>
      )}
    </div>
  );
};

export default LocationFilter;
