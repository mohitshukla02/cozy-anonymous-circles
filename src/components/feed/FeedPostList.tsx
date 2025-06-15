
import React from 'react';
import { Search } from 'lucide-react';
import { Post, Comment, Group } from '../../types/groups';
import PostCard from '../PostCard';

interface FeedPostListProps {
  posts: Post[];
  groups: Group[];
  allComments: Comment[];
  onLikePost: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
  currentUserId: string;
  selectedLocation: string | null;
}

const FeedPostList = ({
  posts,
  groups,
  allComments,
  onLikePost,
  onComment,
  onLikeComment,
  currentUserId,
  selectedLocation
}: FeedPostListProps) => {
  const sortedAndFilteredPosts = posts
    .filter(post => {
      if (!selectedLocation) return true;
      const group = groups.find(g => g.id === post.groupId);
      return group?.locationCity === selectedLocation;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (sortedAndFilteredPosts.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search size={24} className="text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">No posts found</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {selectedLocation ? 'No posts in this location. Try adjusting your filters.' : 'Join some groups to see posts in your feed!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedAndFilteredPosts.map(post => {
        const group = groups.find(g => g.id === post.groupId);
        const postComments = allComments.filter(c => c.postId === post.id);
        
        return (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {group && (
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  {group.image && (
                    <img src={group.image} alt={group.name} className="w-8 h-8 rounded-lg object-cover" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{group.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {group.locationCity && `${group.locationCity}, ${group.locationRegion}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="p-4">
              <PostCard
                post={post}
                authorName="Anonymous"
                comments={postComments}
                onLike={onLikePost}
                onComment={onComment}
                onLikeComment={onLikeComment}
                currentUserId={currentUserId}
                groupId={post.groupId}
                getCommentLikeStatus={(commentId) => {
                  const comment = allComments.find(c => c.id === commentId);
                  return comment?.likes.includes(currentUserId) || false;
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeedPostList;
