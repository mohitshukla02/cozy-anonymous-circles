
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface GroupHeaderProps {
  groupName: string;
  isArchived: boolean;
  memberCount: number;
  postCount: number;
  isJoined: boolean;
  isLocalGroup: boolean;
  onPlanMeetup: () => void;
}

const GroupHeader = ({
  groupName,
  isArchived,
  memberCount,
  postCount,
  isJoined,
  isLocalGroup,
  onPlanMeetup
}: GroupHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={() => navigate('/groups')}
        className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200 hover:shadow-md"
      >
        <ArrowLeft size={20} />
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
            {groupName}
          </h1>
          {isArchived && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              Archived
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {memberCount} members • {postCount} posts
        </p>
      </div>
      
      {/* Quick Plan Meetup button for local groups */}
      {isJoined && isLocalGroup && !isArchived && (
        <Button
          onClick={onPlanMeetup}
          size="sm"
          className="rounded-xl"
        >
          <Calendar size={14} className="mr-1" />
          Plan Meetup
        </Button>
      )}
    </div>
  );
};

export default GroupHeader;
