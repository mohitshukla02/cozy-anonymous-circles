
import React from 'react';
import { Coffee, Users, BookOpen, Gamepad2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const PURPOSE_OPTIONS = [
  { id: 'coffee', label: 'Coffee Chat', icon: Coffee },
  { id: 'walk', label: 'Walk & Talk', icon: Users },
  { id: 'workshop', label: 'Workshop', icon: BookOpen },
  { id: 'games', label: 'Games Night', icon: Gamepad2 },
  { id: 'social', label: 'Social Hangout', icon: Users }
];

interface PurposeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PurposeSelector = ({ value, onChange }: PurposeSelectorProps) => {
  return (
    <div>
      <Label htmlFor="purpose">Purpose</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PURPOSE_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <SelectItem key={option.id} value={option.id}>
                <div className="flex items-center gap-2">
                  <Icon size={14} />
                  {option.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PurposeSelector;
