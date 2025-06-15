
import React from 'react';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

const NotMemberCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white/90 backdrop-blur-sm">
      <CardContent className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users size={24} className="text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 text-sm">
          Join to participate
        </h3>
        <p className="text-gray-600 text-xs mb-4">
          Become a member to view posts and join discussions.
        </p>
        <Button onClick={() => navigate('/groups')} className="rounded-xl">
          Back to Groups
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotMemberCard;
