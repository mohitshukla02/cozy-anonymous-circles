
import React, { useState } from 'react';
import { Heart, MessageSquare, MoreHorizontal } from 'lucide-react';
import { Post, Comment } from '../types/groups';
import { formatDistanceToNow } from 'date-fns';
import InteractionTracker from './InteractionTracker';
import { useAuth } from '@/contexts/AuthContext';

interface PostCardProps {
  post: Post;
  authorName: string;
  comments: Comment[];
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
  getUserName: (userId: string, groupId: string) => string;
  groupId: string;
  isLiked: boolean;
}

const PostCard = ({ 
  post, 
  authorName, 
  comments, 
  onLike, 
  onComment, 
  onLikeComment,
  onReply,
  getUserName,
  groupId,
  isLiked 
}: PostCardProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post.id, newComment.trim());
      setNewComment('');
    }
  };

  const handleSubmitReply = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(commentId, replyContent.trim());
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const topLevelComments = comments.filter(comment => !comment.parentCommentId);
  const getReplies = (commentId: string) => 
    comments.filter(comment => comment.parentCommentId === commentId);

  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-pastel-pink rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-pink-700">
              {authorName.slice(0, 2)}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-800 text-sm">{authorName}</span>
            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.timestamp || post.created_at), { addSuffix: true })}
              {post.edited_at && <span className="ml-1">(edited)</span>}
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {post.content}
      </p>

      <div className="flex items-center gap-4 mb-4">
        <InteractionTracker
          targetUserId={post.authorId || post.author_id}
          groupId={groupId}
          interactionType="like"
          onInteraction={() => onLike(post.id)}
        >
          <button
            className={`flex items-center gap-1 text-sm transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart size={16} className={isLiked ? 'fill-current' : ''} />
            <span>{post.likes.length}</span>
          </button>
        </InteractionTracker>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
        >
          <MessageSquare size={16} />
          <span>{comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="border-t border-gray-100 pt-4 space-y-4">
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value.slice(0, 300))}
              placeholder="Write a comment..."
              maxLength={300}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-amber-600 text-white rounded-full text-sm font-medium hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Post
            </button>
          </form>

          <div className="space-y-3">
            {topLevelComments.map(comment => {
              const replies = getReplies(comment.id);
              const commentAuthor = getUserName(comment.authorId || comment.author_id, groupId);
              const isCommentLiked = comment.likes.includes(user.id);
              
              return (
                <div key={comment.id} className="space-y-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-pastel-blue rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-700">
                            {commentAuthor.slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800 text-xs">{commentAuthor}</span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.timestamp || comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                    <div className="flex items-center gap-3">
                      <InteractionTracker
                        targetUserId={comment.authorId || comment.author_id}
                        groupId={groupId}
                        interactionType="like"
                        onInteraction={() => onLikeComment(comment.id)}
                      >
                        <button
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            isCommentLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                          }`}
                        >
                          <Heart size={12} className={isCommentLiked ? 'fill-current' : ''} />
                          <span>{comment.likes.length}</span>
                        </button>
                      </InteractionTracker>
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="text-xs text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </div>

                  {replyingTo === comment.id && (
                    <form 
                      onSubmit={(e) => handleSubmitReply(e, comment.id)}
                      className="flex gap-2 ml-6"
                    >
                      <input
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value.slice(0, 300))}
                        placeholder="Write a reply..."
                        maxLength={300}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="submit"
                        disabled={!replyContent.trim()}
                        className="px-3 py-2 bg-amber-600 text-white rounded-full text-xs font-medium hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Reply
                      </button>
                    </form>
                  )}

                  {replies.length > 0 && (
                    <div className="ml-6 space-y-2">
                      {replies.map(reply => {
                        const replyAuthor = getUserName(reply.authorId || reply.author_id, groupId);
                        const isReplyLiked = reply.likes.includes(user.id);
                        
                        return (
                          <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-5 h-5 bg-pastel-green rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-green-700">
                                  {replyAuthor.slice(0, 2)}
                                </span>
                              </div>
                              <span className="font-medium text-gray-800 text-xs">{replyAuthor}</span>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(reply.timestamp || reply.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
                            <InteractionTracker
                              targetUserId={reply.authorId || reply.author_id}
                              groupId={groupId}
                              interactionType="like"
                              onInteraction={() => onLikeComment(reply.id)}
                            >
                              <button
                                className={`flex items-center gap-1 text-xs transition-colors ${
                                  isReplyLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                                }`}
                              >
                                <Heart size={12} className={isReplyLiked ? 'fill-current' : ''} />
                                <span>{reply.likes.length}</span>
                              </button>
                            </InteractionTracker>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
