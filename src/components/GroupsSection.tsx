
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Group } from '@/types/groups';
import GroupCard from './GroupCard';
import { Button } from './ui/button';

interface GroupsSectionProps {
  title: string;
  subtitle: string;
  groups: Group[];
  userTags: string[];
  userGroups: string[];
  onJoin: (groupId: string) => void;
  onViewGroup: (group: Group) => void;
  showViewAll?: boolean;
  onViewAll?: () => void;
  emptyIcon: React.ReactNode;
  emptyMessage: string;
  emptySubMessage: string;
}

const GroupsSection = ({
  title,
  subtitle,
  groups,
  userTags,
  userGroups,
  onJoin,
  onViewGroup,
  showViewAll,
  onViewAll,
  emptyIcon,
  emptyMessage,
  emptySubMessage
}: GroupsSectionProps) => {
  if (groups.length === 0) {
    return (
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
        
        <div className="text-center py-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
          {emptyIcon}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{emptyMessage}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{emptySubMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
        {showViewAll && onViewAll && (
          <Button variant="outline" onClick={onViewAll} className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            View all
            <ChevronRight size={16} className="ml-1" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            userTags={userTags}
            isJoined={userGroups.includes(group.id)}
            onJoin={onJoin}
            onView={onViewGroup}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupsSection;
