import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import { Post, Comment } from '../../types/groups';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useToast } from '../../hooks/use-toast';
import { deleteComment } from '../../utils/supabaseStorage';

interface PostsSectionProps {
  posts: Post[];
  comments: Comment[];
  sortBy: 'recent' | 'liked' | 'discussed';
  onSortChange: (sortBy: 'recent' | 'liked' | 'discussed') => void;
  currentUserId: string;
  groupId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
  getCommentLikeStatus: (commentId: string) => boolean;
  isArchived: boolean;
  isAdmin?: boolean;
}

const PostsSection = ({
  posts,
  comments,
  sortBy,
  onSortChange,
  currentUserId,
  groupId,
  onLike,
  onComment,
  onLikeComment,
  getCommentLikeStatus,
  isArchived,
  isAdmin = false
}: PostsSectionProps) => {
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const togglePostExpansion = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const handleCommentSubmit = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (content) {
      onComment(postId, content);
      setCommentInputs({ ...commentInputs, [postId]: '' });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
      // Trigger a reload by calling the parent component's reload function
      window.location.reload();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case 'liked':
        return b.likes.length - a.likes.length;
      case 'discussed':
        return b.commentCount - a.commentCount;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
        <p>No posts yet. Be the first to start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex gap-2">
        <Badge 
          variant={sortBy === 'recent' ? 'default' : 'outline'} 
          className="cursor-pointer" 
          onClick={() => onSortChange('recent')}
        >
          Recent
        </Badge>
        <Badge 
          variant={sortBy === 'liked' ? 'default' : 'outline'} 
          className="cursor-pointer" 
          onClick={() => onSortChange('liked')}
        >
          Most Liked
        </Badge>
        <Badge 
          variant={sortBy === 'discussed' ? 'default' : 'outline'} 
          className="cursor-pointer" 
          onClick={() => onSortChange('discussed')}
        >
          Most Discussed
        </Badge>
      </div>

      {/* Posts List */}
      {sortedPosts.map((post) => {
        const postComments = comments.filter(c => c.postId === post.id);
        const isExpanded = expandedPosts.has(post.id);
        const isLiked = post.likes.includes(currentUserId);

        return (
          <div key={post.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-0 shadow-sm">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-900 leading-relaxed">{post.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                  {post.editedAt && ' • edited'}
                </p>
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => onLike(post.id)}
                disabled={isArchived}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isLiked 
                    ? 'bg-pink-50 text-pink-600' 
                    : 'text-gray-500 hover:bg-gray-50'
                } ${isArchived ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{post.likes.length}</span>
              </button>

              <button
                onClick={() => togglePostExpansion(post.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <MessageCircle size={14} />
                <span>{post.commentCount}</span>
              </button>
            </div>

            {/* Comments Section */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {/* Existing Comments */}
                {postComments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{comment.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => onLikeComment(comment.id)}
                          disabled={isArchived}
                          className={`flex items-center gap-1 text-xs ${
                            getCommentLikeStatus(comment.id) 
                              ? 'text-pink-600' 
                              : 'text-gray-500 hover:text-gray-700'
                          } ${isArchived ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Heart size={12} fill={getCommentLikeStatus(comment.id) ? 'currentColor' : 'none'} />
                          <span>{comment.likes.length}</span>
                        </button>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                      </div>
                    </div>
                    
                    {/* Comment Actions - Show for comment author or admin */}
                    {(comment.authorId === currentUserId || isAdmin) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}

                {/* Add Comment */}
                {!isArchived && (
                  <div className="flex gap-3">
                    <Textarea
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      className="flex-1 min-h-[80px] resize-none bg-white"
                    />
                    <Button
                      onClick={() => handleCommentSubmit(post.id)}
                      disabled={!commentInputs[post.id]?.trim()}
                      size="sm"
                      className="self-end"
                    >
                      Reply
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PostsSection;
