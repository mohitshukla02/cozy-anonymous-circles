
import React, { useState } from 'react';
import { Heart, MessageCircle, MoreVertical } from 'lucide-react';
import { Post, Comment } from '../types/groups';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import UserAvatarWithName from './UserAvatarWithName';
import { trackUserInteraction } from '../utils/supabaseHelpers';

interface PostCardProps {
  post: Post;
  authorName: string;
  comments: Comment[];
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
  currentUserId: string;
  getAuthorName: (userId: string) => string;
  groupId: string;
  isLiked: boolean;
  getCommentLikeStatus: (commentId: string) => boolean;
}

const PostCard = ({ 
  post, 
  comments, 
  onLike, 
  onComment, 
  onLikeComment, 
  currentUserId, 
  groupId, 
  isLiked, 
  getCommentLikeStatus 
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = async () => {
    await trackUserInteraction(currentUserId, post.authorId, groupId, 'like');
    onLike(post.id);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await trackUserInteraction(currentUserId, post.authorId, groupId, 'comment');
    onComment(post.id, newComment.trim());
    setNewComment('');
  };

  const handleCommentLike = async (commentId: string, commentAuthorId: string) => {
    await trackUserInteraction(currentUserId, commentAuthorId, groupId, 'like');
    onLikeComment(commentId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes < 1 ? 'Just now' : `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    }
  };

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <UserAvatarWithName userId={post.authorId} groupId={groupId} />
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{formatDate(post.createdAt)}</span>
            <Button variant="ghost" size="sm" className="h-auto p-1 rounded-lg">
              <MoreVertical size={14} />
            </Button>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
          {post.editedAt && (
            <p className="text-xs text-gray-400 mt-2">
              Edited {formatDate(post.editedAt)}
            </p>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`h-auto p-2 gap-2 rounded-xl ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-xs">{post.likes.length}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="h-auto p-2 gap-2 text-gray-500 rounded-xl"
          >
            <MessageCircle size={16} />
            <span className="text-xs">{comments.length}</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <>
            <Separator className="mb-4" />
            
            {/* Comment Form */}
            <form onSubmit={handleComment} className="mb-4">
              <div className="flex items-start gap-3">
                <UserAvatarWithName userId={currentUserId} groupId={groupId} showName={false} />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value.slice(0, 250))}
                    placeholder="Write a comment..."
                    maxLength={250}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">
                      {newComment.length}/250
                    </span>
                    <Button
                      type="submit"
                      disabled={!newComment.trim()}
                      size="sm"
                      className="rounded-xl"
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex items-start gap-3">
                  <UserAvatarWithName userId={comment.authorId} groupId={groupId} showName={false} />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <UserAvatarWithName userId={comment.authorId} groupId={groupId} showName={true} className="text-xs" />
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCommentLike(comment.id, comment.authorId)}
                        className={`h-auto p-1 gap-1 text-xs rounded-lg ${
                          getCommentLikeStatus(comment.id) ? 'text-red-500' : 'text-gray-500'
                        }`}
                      >
                        <Heart size={12} fill={getCommentLikeStatus(comment.id) ? 'currentColor' : 'none'} />
                        {comment.likes.length > 0 && <span>{comment.likes.length}</span>}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
