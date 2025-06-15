
import React from 'react';

const FeedLoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-gray-100/30 dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-700/30 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedLoadingState;
