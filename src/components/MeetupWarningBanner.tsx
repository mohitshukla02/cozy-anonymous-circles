
import React from 'react';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface MeetupWarningBannerProps {
  warningLevel: 'none' | 'week2' | 'week1' | 'final';
  nextDeadline: string;
  onPlanMeetup: () => void;
  isArchived: boolean;
}

const MeetupWarningBanner = ({ warningLevel, nextDeadline, onPlanMeetup, isArchived }: MeetupWarningBannerProps) => {
  if (warningLevel === 'none' || isArchived) return null;

  const deadline = new Date(nextDeadline);
  const now = new Date();
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const getWarningConfig = () => {
    switch (warningLevel) {
      case 'week2':
        return {
          variant: 'default' as const,
          icon: Clock,
          title: '2 weeks until this group expires',
          message: 'Plan a meetup to keep this group alive!',
          bgColor: 'bg-blue-50/80',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        };
      case 'week1':
        return {
          variant: 'default' as const,
          icon: AlertTriangle,
          title: '1 week left',
          message: 'Only a meetup can save this group now.',
          bgColor: 'bg-yellow-50/80',
          borderColor: 'border-yellow-300',
          textColor: 'text-yellow-800'
        };
      case 'final':
        return {
          variant: 'destructive' as const,
          icon: AlertTriangle,
          title: 'Group will archive in 2 days',
          message: 'Final chance - meet now or lose this community forever!',
          bgColor: 'bg-red-50/80',
          borderColor: 'border-red-300',
          textColor: 'text-red-800'
        };
      default:
        return null;
    }
  };

  const config = getWarningConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Alert className={`mb-6 ${config.bgColor} ${config.borderColor} border-2`}>
      <Icon size={20} className={config.textColor} />
      <AlertDescription className="flex items-center justify-between">
        <div className={config.textColor}>
          <div className="font-semibold text-sm">{config.title}</div>
          <div className="text-xs mt-1">{config.message}</div>
          <div className="flex items-center gap-2 mt-2">
            <Calendar size={12} />
            <span className="text-xs">{daysLeft} days remaining</span>
          </div>
        </div>
        <Button 
          onClick={onPlanMeetup}
          size="sm"
          variant={warningLevel === 'final' ? 'destructive' : 'default'}
          className="ml-4"
        >
          Plan Meetup Now
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default MeetupWarningBanner;
