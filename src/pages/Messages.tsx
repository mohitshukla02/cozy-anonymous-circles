
import React from 'react';
import { MessageCircle } from 'lucide-react';
import PlaceholderPage from './PlaceholderPage';

const Messages = () => {
  return (
    <PlaceholderPage
      title="Direct Messages"
      description="Have private, meaningful conversations with your connections. All messages remain anonymous and secure."
      icon={<MessageCircle className="text-white" size={32} />}
    />
  );
};

export default Messages;
