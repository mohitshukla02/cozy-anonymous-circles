
import React from 'react';
import { TrendingUp, MessageCircle, Heart } from 'lucide-react';
import { Post, Comment } from '../../types/groups';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import PostCard from '../PostCard';

interface PostsSectionProps {
  posts: Post[];
  comments: Comment[];
  sortBy: 'recent' | 'liked' | 'discussed';
  onSortChange: (sort: 'recent' | 'liked' | 'discussed') => void;
  currentUserId: string;
  groupId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
  getCommentLikeStatus: (commentId: string) => boolean;
  isArchived: boolean;
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
  isArchived
}: PostsSectionProps) => {
  const getSortedPosts = () => {
    const sortedPosts = [...posts];
    
    switch (sortBy) {
      case 'liked':
        return sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
      case 'discussed':
        return sortedPosts.sort((a, b) => {
          const aComments = comments.filter(c => c.postId === a.id).length;
          const bComments = comments.filter(c => c.postId === b.id).length;
          return bComments - aComments;
        });
      case 'recent':
      default:
        return sortedPosts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const sortedPosts = getSortedPosts();

  return (
    <>
      {/* Sort Options */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'recent', label: 'Recent', icon: TrendingUp },
          { key: 'liked', label: 'Liked', icon: Heart },
          { key: 'discussed', label: 'Discussed', icon: MessageCircle }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={sortBy === key ? "default" : "outline"}
            size="sm"
            onClick={() => onSortChange(key as any)}
            className="rounded-xl"
          >
            <Icon size={12} className="mr-1" />
            {label}
          </Button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {sortedPosts.length === 0 ? (
          <Card className="rounded-2xl border-0 shadow-sm bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                No posts yet
              </h3>
              <p className="text-gray-600 text-xs">
                {isArchived ? 'This group has been archived.' : 'Be the first to start a conversation!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              authorName={''}
              comments={comments.filter(c => c.postId === post.id)}
              onLike={onLike}
              onComment={onComment}
              onLikeComment={onLikeComment}
              currentUserId={currentUserId}
              getAuthorName={() => ''}
              groupId={groupId}
              isLiked={post.likes.includes(currentUserId)}
              getCommentLikeStatus={getCommentLikeStatus}
            />
          ))
        )}
      </div>
    </>
  );
};

export default PostsSection;
