
import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, MapPin, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Post, Comment, UserGroup, Group } from '../types/groups';
import { getUserGroups, getPostsByGroup, getCommentsByPost, likePost, likeComment, getGroupById } from '../utils/supabaseStorage';
import { Button } from '../components/ui/button';
import PostCard from '../components/PostCard';

const Feed = () => {
  const { user } = useAuth();
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const userGroupsData = await getUserGroups(user.id);
        setUserGroups(userGroupsData);

        // Fetch group details for each user group
        const groupsData: Group[] = [];
        for (const userGroup of userGroupsData) {
          try {
            const group = await getGroupById(userGroup.groupId);
            if (group) {
              groupsData.push(group);
            }
          } catch (error) {
            console.error(`Error fetching group ${userGroup.groupId}:`, error);
          }
        }
        setGroups(groupsData);

        const posts: Post[] = [];
        const comments: Comment[] = [];

        for (const userGroup of userGroupsData) {
          const groupPosts = await getPostsByGroup(userGroup.groupId);
          posts.push(...groupPosts);

          for (const post of groupPosts) {
            const postComments = await getCommentsByPost(post.id);
            comments.push(...postComments);
          }
        }

        setAllPosts(posts);
        setAllComments(comments);
      } catch (error) {
        console.error('Error loading feed data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleLikePost = async (postId: string) => {
    if (!user) return;

    try {
      await likePost(postId);
      
      // Update local state
      setAllPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const userLiked = post.likes.includes(user.id);
            return {
              ...post,
              likes: userLiked 
                ? post.likes.filter(id => id !== user.id) 
                : [...post.likes, user.id]
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    if (!user) return;

    try {
      // This is a simplified version - in a real app, you'd add the comment to the database
      // and then update the local state with the new comment
      console.log(`Adding comment to post ${postId}: ${content}`);
      
      // For now, we'll just reload the data
      const updatedComments = await getCommentsByPost(postId);
      setAllComments(prev => {
        const filtered = prev.filter(c => c.postId !== postId);
        return [...filtered, ...updatedComments];
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    try {
      await likeComment(commentId);
      
      // Update local state
      setAllComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            const userLiked = comment.likes.includes(user.id);
            return {
              ...comment,
              likes: userLiked 
                ? comment.likes.filter(id => id !== user.id) 
                : [...comment.likes, user.id]
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const getUserName = async (userId: string): Promise<string> => {
    // This would typically fetch the user's name from a database
    // For now, we'll just return a placeholder
    return `User ${userId.substring(0, 5)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/30 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sortedAndFilteredPosts = allPosts
    .filter(post => {
      if (!selectedLocation) return true;
      const group = groups.find(g => g.id === post.groupId);
      return group?.locationCity === selectedLocation;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/30">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Feed</h1>
            <p className="text-gray-600 dark:text-gray-400">Stay connected with your groups and communities</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLocationFilter(!showLocationFilter)}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <MapPin size={16} className="mr-2" />
              Location
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{userGroups.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your Groups</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{allPosts.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Recent Posts</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{allComments.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Activity</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Plus size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Location Filter */}
        {showLocationFilter && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Filter by Location</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(groups.map(g => g.locationCity).filter(Boolean))).map(city => (
                <Button
                  key={city}
                  variant={selectedLocation === city ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLocation(selectedLocation === city ? null : city)}
                  className="dark:border-gray-700 dark:text-gray-300"
                >
                  {city}
                </Button>
              ))}
              {selectedLocation && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLocation(null)}
                  className="dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {sortedAndFilteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">No posts found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {selectedLocation ? 'No posts in this location. Try adjusting your filters.' : 'Join some groups to see posts in your feed!'}
              </p>
            </div>
          ) : (
            sortedAndFilteredPosts.map(post => {
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
                      onLike={handleLikePost}
                      onComment={handleComment}
                      onLikeComment={handleLikeComment}
                      currentUserId={user.id}
                      groupId={post.groupId}
                      getCommentLikeStatus={(commentId) => {
                        const comment = allComments.find(c => c.id === commentId);
                        return comment?.likes.includes(user.id) || false;
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
