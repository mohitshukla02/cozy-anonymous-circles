
import React from 'react';
import { Users, TrendingUp, Plus } from 'lucide-react';
import { UserGroup, Post, Comment } from '../../types/groups';

interface FeedStatsProps {
  userGroups: UserGroup[];
  allPosts: Post[];
  allComments: Comment[];
}

const FeedStats = ({ userGroups, allPosts, allComments }: FeedStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{userGroups.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your Groups</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Users size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{allPosts.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Recent Posts</p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{allComments.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Activity</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Plus size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedStats;
