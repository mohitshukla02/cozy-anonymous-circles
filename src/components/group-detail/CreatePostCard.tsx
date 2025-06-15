
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import UserAvatarWithName from '../UserAvatarWithName';

interface CreatePostCardProps {
  userId: string;
  groupId: string;
  onCreatePost: (content: string) => Promise<void>;
}

const CreatePostCard = ({ userId, groupId, onCreatePost }: CreatePostCardProps) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onCreatePost(newPostContent.trim());
      setNewPostContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6 rounded-2xl border-0 shadow-sm bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start gap-4">
            <UserAvatarWithName userId={userId} groupId={groupId} showName={false} />
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value.slice(0, 500))}
                placeholder="Share your thoughts with the group..."
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-400">
                  {newPostContent.length}/500
                </span>
                <Button
                  type="submit"
                  disabled={!newPostContent.trim() || isSubmitting}
                  size="sm"
                  className="rounded-xl"
                >
                  <Plus size={14} className="mr-1" />
                  {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostCard;
