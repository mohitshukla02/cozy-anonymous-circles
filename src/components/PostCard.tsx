import React, { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { Post, Comment } from '../types/groups';
import { useAuth } from '../contexts/AuthContext';
import UserAvatarWithName from './UserAvatarWithName';

export interface PostCardProps {
  post: Post;
  authorName?: string;
  comments: Comment[];
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
  getCommentLikeStatus: (commentId: string) => boolean;
  currentUserId: string;
  groupId: string;
  isArchived?: boolean;
}

const PostCard = ({ 
  post, 
  authorName,
  comments, 
  onLike, 
  onComment, 
  onLikeComment, 
  getCommentLikeStatus, 
  currentUserId, 
  groupId,
  isArchived = false 
}: PostCardProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  const postComments = comments.filter(c => c.postId === post.id);
  const isLiked = post.likes.includes(currentUserId);
  
  const handleSubmitComment = () => {
    if (newComment.trim() && !isArchived) {
      onComment(post.id, newComment.trim());
      setNewComment('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <UserAvatarWithName 
              userId={post.authorId} 
              groupId={groupId} 
              size="sm"
              showTime={true}
              timestamp={post.createdAt}
            />
          </div>
          
          <Button variant="ghost" size="sm" className="opacity-50">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
          {post.editedAt && (
            <p className="text-xs text-gray-500 mt-1">
              Edited {formatDistanceToNow(new Date(post.editedAt), { addSuffix: true })}
            </p>
          )}
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
          {post.likes.length > 0 && (
            <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
          )}
          {postComments.length > 0 && (
            <span>{postComments.length} {postComments.length === 1 ? 'comment' : 'comments'}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => !isArchived && onLike(post.id)}
            disabled={isArchived}
            className={`flex items-center gap-2 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            Like
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <MessageCircle className="w-4 h-4" />
            Comment
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-3">
            {/* Existing Comments */}
            {postComments
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <UserAvatarWithName 
                    userId={comment.authorId} 
                    groupId={groupId} 
                    size="sm"
                    showName={false}
                  />
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <UserAvatarWithName 
                        userId={comment.authorId} 
                        groupId={groupId} 
                        size="sm"
                        showName={true}
                        className="!gap-1"
                      />
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mb-2">{comment.content}</p>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => !isArchived && onLikeComment(comment.id)}
                        disabled={isArchived}
                        className={`h-6 px-2 text-xs ${
                          getCommentLikeStatus(comment.id) ? 'text-red-500' : 'text-gray-500'
                        }`}
                      >
                        <Heart className={`w-3 h-3 mr-1 ${getCommentLikeStatus(comment.id) ? 'fill-current' : ''}`} />
                        {comment.likes.length || ''}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

            {/* New Comment Input */}
            {!isArchived && (
              <div className="flex gap-3">
                <UserAvatarWithName 
                  userId={currentUserId} 
                  groupId={groupId} 
                  size="sm"
                  showName={false}
                />
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    onKeyPress={handleKeyPress}
                    className="min-h-[60px] resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      size="sm" 
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                    >
                      Comment
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
