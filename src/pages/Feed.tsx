
import React from 'react';
import { Rss } from 'lucide-react';
import PlaceholderPage from './PlaceholderPage';

const Feed = () => {
  return (
    <PlaceholderPage
      title="Personal Feed"
      description="Stay updated with posts and conversations from your joined groups and connections. A curated, distraction-free feed focused on quality content."
      icon={<Rss className="text-white" size={32} />}
    />
  );
};

export default Feed;
