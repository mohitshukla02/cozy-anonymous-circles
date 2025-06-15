
import React, { useState } from 'react';
import { useFeedData } from '../hooks/useFeedData';
import FeedHeader from '../components/feed/FeedHeader';
import FeedStats from '../components/feed/FeedStats';
import FeedFilters from '../components/feed/FeedFilters';
import FeedLoadingState from '../components/feed/FeedLoadingState';
import FeedPostList from '../components/feed/FeedPostList';

const Feed = () => {
  const {
    userGroups,
    groups,
    allPosts,
    allComments,
    loading,
    handleLikePost,
    handleComment,
    handleLikeComment,
    user
  } = useFeedData();

  const [showFilters, setShowFilters] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  if (loading) {
    return <FeedLoadingState />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-gray-100/30 dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-700/30">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <FeedHeader
          onToggleLocationFilter={() => setShowLocationFilter(!showLocationFilter)}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        <FeedStats
          userGroups={userGroups}
          allPosts={allPosts}
          allComments={allComments}
        />

        <FeedFilters
          showLocationFilter={showLocationFilter}
          groups={groups}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />

        <FeedPostList
          posts={allPosts}
          groups={groups}
          allComments={allComments}
          onLikePost={handleLikePost}
          onComment={handleComment}
          onLikeComment={handleLikeComment}
          currentUserId={user.id}
          selectedLocation={selectedLocation}
        />
      </div>
    </div>
  );
};

export default Feed;
