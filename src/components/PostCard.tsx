import React, { useState } from 'react';
import { Heart, MessageSquare, Send, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { formatDistanceToNow } from 'date-fns';
import UserAvatarWithName from './UserAvatarWithName';
import InteractionTracker from './InteractionTracker';
import { Post, Comment } from '../types/groups';

interface PostCardProps {
  post: Post;
  comments: Comment[];
  currentUserId: string;
  groupId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
  getCommentLikeStatus: (commentId: string) => boolean;
  isArchived?: boolean;
}

const PostCard = ({ 
  post, 
  comments, 
  currentUserId, 
  groupId,
  onLike, 
  onComment, 
  onLikeComment, 
  getCommentLikeStatus,
  isArchived = false
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postComments = comments.filter(comment => comment.postId === post.id);
  const isLiked = post.likes.includes(currentUserId);
  const canInteract = !isArchived;

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onComment(post.id, newComment.trim());
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <UserAvatarWithName 
            userId={post.authorId}
            groupId={groupId}
            showTime={true}
            timestamp={post.createdAt}
          />
          <Button variant="ghost" size="sm" className="rounded-xl">
            <MoreHorizontal size={16} />
          </Button>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
          {post.editedAt && (
            <p className="text-xs text-gray-400 mt-2">
              Edited {formatDistanceToNow(new Date(post.editedAt), { addSuffix: true })}
            </p>
          )}
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          {post.likes.length > 0 && (
            <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
          )}
          {postComments.length > 0 && (
            <span>{postComments.length} {postComments.length === 1 ? 'comment' : 'comments'}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
          <InteractionTracker
            targetUserId={post.authorId}
            groupId={groupId}
            interactionType="like"
            onInteraction={() => canInteract && onLike(post.id)}
          >
            <Button
              variant={isLiked ? "default" : "ghost"}
              size="sm"
              className="rounded-xl flex-1"
              disabled={!canInteract}
            >
              <Heart size={16} className={`mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
          </InteractionTracker>
          
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl flex-1"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare size={16} className="mr-2" />
            Comment
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-4">
            {/* Existing Comments */}
            {postComments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl p-3">
                    <UserAvatarWithName 
                      userId={comment.authorId}
                      groupId={groupId}
                      size="sm"
                      showTime={true}
                      timestamp={comment.createdAt}
                    />
                    <p className="text-gray-800 mt-2 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                  
                  {/* Comment Actions */}
                  <div className="flex items-center gap-3 mt-2 ml-3">
                    <InteractionTracker
                      targetUserId={comment.authorId}
                      groupId={groupId}
                      interactionType="like"
                      onInteraction={() => canInteract && onLikeComment(comment.id)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs h-auto p-1 ${
                          getCommentLikeStatus(comment.id) ? 'text-red-500' : 'text-gray-500'
                        }`}
                        disabled={!canInteract}
                      >
                        <Heart size={12} className={`mr-1 ${getCommentLikeStatus(comment.id) ? 'fill-current' : ''}`} />
                        {comment.likes.length > 0 && comment.likes.length}
                      </Button>
                    </InteractionTracker>
                  </div>
                </div>
              </div>
            ))}

            {/* New Comment Input */}
            {canInteract && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="border-0 bg-gray-50 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || isSubmitting}
                      size="sm"
                      className="rounded-xl"
                    >
                      <Send size={14} className="mr-1" />
                      {isSubmitting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
