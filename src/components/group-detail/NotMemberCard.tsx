
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Users, Lock } from 'lucide-react';

interface NotMemberCardProps {
  onJoin: () => void;
}

const NotMemberCard = ({ onJoin }: NotMemberCardProps) => {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white/90 backdrop-blur-sm">
      <CardContent className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Users size={24} className="text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-3 text-lg">
          Join this group to participate
        </h3>
        <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
          Connect with like-minded people and join the conversation. You'll be able to see posts, comment, and participate in group activities.
        </p>
        <Button
          onClick={onJoin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
        >
          Join Group
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotMemberCard;
