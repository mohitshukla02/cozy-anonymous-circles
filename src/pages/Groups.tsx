
import React from 'react';
import { Users } from 'lucide-react';
import PlaceholderPage from './PlaceholderPage';

const Groups = () => {
  return (
    <PlaceholderPage
      title="Interest Groups"
      description="Discover and join communities based on your hobbies, interests, and passions. Connect with like-minded people in a safe, anonymous environment."
      icon={<Users className="text-white" size={32} />}
    />
  );
};

export default Groups;
