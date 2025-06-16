
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../ui/badge';
import AdminGroupActions from '../AdminGroupActions';

interface GroupHeaderProps {
  groupName: string;
  isArchived: boolean;
  memberCount: number;
  postCount: number;
  isJoined: boolean;
  isLocalGroup: boolean;
  isAdmin: boolean;
  groupId: string;
  currentImage?: string;
  onPlanMeetup: () => void;
  onGroupDeleted: () => void;
  onImageUpdated?: () => void;
}

const GroupHeader = ({
  groupName,
  isArchived,
  memberCount,
  postCount,
  isJoined,
  isLocalGroup,
  isAdmin,
  groupId,
  currentImage,
  onPlanMeetup,
  onGroupDeleted,
  onImageUpdated
}: GroupHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={() => navigate('/groups')}
        className="p-3 rounded-2xl bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md"
      >
        <ArrowLeft size={20} />
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
            {groupName}
          </h1>
          {isArchived && (
            <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              Archived
            </Badge>
          )}
          {isAdmin && (
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
              Admin
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {memberCount} members • {postCount} posts
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Admin Actions */}
        <AdminGroupActions
          groupId={groupId}
          groupName={groupName}
          isAdmin={isAdmin}
          currentImage={currentImage}
          onGroupDeleted={onGroupDeleted}
          onImageUpdated={onImageUpdated}
        />
      </div>
    </div>
  );
};

export default GroupHeader;
