
import React from 'react';
import { Globe, MapPin, ArrowRight } from 'lucide-react';
import { Group } from '@/types/groups';
import GroupCard from './GroupCard';

interface GroupsSectionProps {
  title: string;
  subtitle: string;
  groups: Group[];
  userTags: string[];
  userGroups: string[];
  onJoin: (groupId: string) => void;
  showViewAll?: boolean;
  onViewAll?: () => void;
  emptyIcon?: React.ReactNode;
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
  showViewAll = false,
  onViewAll,
  emptyIcon,
  emptyMessage,
  emptySubMessage
}: GroupsSectionProps) => {
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-1">{title}</h2>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>
        {showViewAll && onViewAll && (
          <button
            onClick={onViewAll}
            className="text-gray-900 font-medium hover:underline flex items-center text-sm"
          >
            Show all
            <ArrowRight className="ml-1" size={16} />
          </button>
        )}
      </div>
      
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map(group => (
            <GroupCard 
              key={group.id} 
              group={group} 
              userTags={userTags}
              onJoin={onJoin}
              isJoined={userGroups.includes(group.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          {emptyIcon || <Globe size={48} className="mx-auto text-gray-400 mb-4" />}
          <p className="text-gray-500 text-lg">{emptyMessage}</p>
          <p className="text-gray-400 text-sm mt-2">{emptySubMessage}</p>
        </div>
      )}
    </div>
  );
};

export default GroupsSection;
