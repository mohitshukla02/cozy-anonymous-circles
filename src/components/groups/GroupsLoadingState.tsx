
import React from 'react';

const GroupsLoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:bg-gradient-dark pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="animate-pulse space-y-6">
          <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 h-64 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsLoadingState;
