import React, { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Post, Comment } from '@/types/groups';
import { formatDistanceToNow } from 'date-fns';
import InteractionTracker from './InteractionTracker';

interface PostCardProps {
  post: Post;
  authorName: string;
  comments: Comment[];
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
  onEditPost?: (postId: string, content: string) => void;
  onDeletePost?: (postId: string) => void;
  onEditComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  isLiked: boolean;
  getCommentLikeStatus: (commentId: string) => boolean;
  getAuthorName: (authorId: string) => string;
  currentUserId: string;
  groupId: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  authorName,
  comments,
  onLike,
  onComment,
  onLikeComment,
  onEditPost,
  onDeletePost,
  onEditComment,
  onDeleteComment,
  isLiked,
  getCommentLikeStatus,
  getAuthorName,
  currentUserId,
  groupId
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState(post.content);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  const handleLike = () => {
    onLike(post.id);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post.id, newComment.trim());
      setNewComment('');
      setShowCommentForm(false);
    }
  };

  const handleEditPost = () => {
    setEditingPost(true);
    setEditPostContent(post.content);
  };

  const handleSavePostEdit = () => {
    if (editPostContent.trim()) {
      onEditPost?.(post.id, editPostContent.trim());
      setEditingPost(false);
    }
  };

  const handleCancelCommentEdit = () => {
    setEditingComment(null);
    setEditCommentContent('');
  };

  const handleEditComment = (commentId: string, content: string) => {
    setEditingComment(commentId);
    setEditCommentContent(content);
  };

  const handleSaveCommentEdit = (commentId: string) => {
    if (editCommentContent.trim()) {
      onEditComment?.(commentId, editCommentContent.trim());
      setEditingComment(null);
      setEditCommentContent('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {authorName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{authorName}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              {post.editedAt && ' (edited)'}
            </p>
          </div>
        </div>
        
        {post.authorId === currentUserId && (
          <div className="relative">
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <MoreHorizontal size={16} className="text-gray-500" />
            </button>
          </div>
        )}
      </div>

      {editingPost ? (
        <div className="mb-4">
          <textarea
            value={editPostContent}
            onChange={(e) => setEditPostContent(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={3}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setEditingPost(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePostEdit}
              className="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <InteractionTracker
            targetUserId={post.authorId}
            groupId={groupId}
            onInteraction={handleLike}
            interactionType="like"
          >
            <button className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}>
              <Heart size={18} className={isLiked ? 'fill-current' : ''} />
              <span className="text-sm">{post.likes.length}</span>
            </button>
          </InteractionTracker>

          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={18} />
            <span className="text-sm">{comments.length}</span>
          </button>
        </div>

        {comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            {showComments ? 'Hide' : 'Show'} comments
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <form onSubmit={handleSubmitComment} className="mt-4 pt-4 border-t border-gray-100">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={2}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              type="button"
              onClick={() => setShowCommentForm(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600 disabled:opacity-50"
            >
              Comment
            </button>
          </div>
        </form>
      )}

      {/* Comments */}
      {showComments && comments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">
                  {getAuthorName(comment.authorId).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900">
                      {getAuthorName(comment.authorId)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div>
                      <textarea
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded text-sm resize-none"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={handleCancelCommentEdit}
                          className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveCommentEdit(comment.id)}
                          className="px-2 py-1 text-xs bg-amber-500 text-white rounded hover:bg-amber-600"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-800">{comment.content}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <InteractionTracker
                    targetUserId={comment.authorId}
                    groupId={groupId}
                    onInteraction={() => onLikeComment(comment.id)}
                    interactionType="like"
                  >
                    <button className={`flex items-center space-x-1 text-xs transition-colors ${
                      getCommentLikeStatus(comment.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}>
                      <Heart size={14} className={getCommentLikeStatus(comment.id) ? 'fill-current' : ''} />
                      <span>{comment.likes.length}</span>
                    </button>
                  </InteractionTracker>

                  {comment.authorId === currentUserId && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditComment(comment.id, comment.content)}
                        className="text-xs text-gray-500 hover:text-amber-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteComment?.(comment.id)}
                        className="text-xs text-gray-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
