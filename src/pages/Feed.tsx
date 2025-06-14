
import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, MapPin, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getGroups, getPostsByGroup, getCommentsByPost, getUserGroups, createPost, likePost, createComment, likeComment } from '../utils/supabaseStorage';
import { Post, Comment, Group } from '../types/groups';
import PostCard from '../components/PostCard';

const Feed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'local' | 'interest' | 'my-posts'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'engaged' | 'trending'>('recent');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      const allGroups = await getGroups();
      const userGroupData = await getUserGroups(user.id);
      
      setGroups(allGroups);
      setUserGroups(userGroupData.map(ug => ug.groupId));

      // Load posts from user's groups
      const userGroupIds = userGroupData.map(ug => ug.groupId);
      const allPosts: Post[] = [];
      const allComments: Comment[] = [];

      for (const groupId of userGroupIds) {
        const groupPosts = await getPostsByGroup(groupId);
        allPosts.push(...groupPosts);

        for (const post of groupPosts) {
          const postComments = await getCommentsByPost(post.id);
          allComments.push(...postComments);
        }
      }

      setPosts(allPosts);
      setComments(allComments);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const group = groups.find(g => g.id === post.groupId);
    if (!group) return false;

    // Apply filter
    switch (activeFilter) {
      case 'local':
        return group.type === 'local-meetup';
      case 'interest':
        return group.type === 'interest';
      case 'my-posts':
        return post.authorId === user?.id;
      default:
        return true;
    }
  }).filter(post => {
    if (!searchTerm) return true;
    const group = groups.find(g => g.id === post.groupId);
    return post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
           group?.name.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a, b) => {
    switch (sortBy) {
      case 'engaged':
        const aEngagement = a.likes.length + comments.filter(c => c.postId === a.id).length;
        const bEngagement = b.likes.length + comments.filter(c => c.postId === b.id).length;
        return bEngagement - aEngagement;
      case 'trending':
        // Simple trending based on recent engagement
        const aRecent = a.likes.length + comments.filter(c => c.postId === a.id && 
          Date.now() - new Date(c.createdAt).getTime() < 24 * 60 * 60 * 1000).length;
        const bRecent = b.likes.length + comments.filter(c => c.postId === b.id && 
          Date.now() - new Date(c.createdAt).getTime() < 24 * 60 * 60 * 1000).length;
        return bRecent - aRecent;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleCreatePost = async () => {
    if (!user || !newPostContent.trim() || !selectedGroupId) return;

    try {
      await createPost({
        groupId: selectedGroupId,
        authorId: user.id,
        content: newPostContent.trim(),
        editedAt: undefined
      });

      setNewPostContent('');
      setSelectedGroupId('');
      setShowCreatePost(false);
      loadData(); // Reload data
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;
    try {
      await likePost(postId);
      loadData(); // Reload data
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    if (!user) return;
    try {
      await createComment({
        postId,
        authorId: user.id,
        content
      });
      loadData(); // Reload data
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;
    try {
      await likeComment(commentId);
      loadData(); // Reload data
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const getUserName = (authorId: string) => {
    // For now, return a placeholder. In a real app, you'd get this from user_groups table
    return 'Anonymous User';
  };

  const getGroupName = (groupId: string) => {
    return groups.find(g => g.id === groupId)?.name || 'Unknown Group';
  };

  const userJoinedGroups = groups.filter(g => userGroups.includes(g.id));
  const localGroups = userJoinedGroups.filter(g => g.type === 'local-meetup');
  const interestGroups = userJoinedGroups.filter(g => g.type === 'interest');

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Feed</h1>
          <p className="text-sm text-gray-600">
            Posts from your {userJoinedGroups.length} joined groups
          </p>
        </div>

        {/* Create Post Section */}
        {!showCreatePost ? (
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 text-sm"
            >
              Share something with your communities...
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
            <div className="space-y-3">
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a group to post in...</option>
                {localGroups.length > 0 && (
                  <optgroup label="Local Meetup Groups">
                    {localGroups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name} {group.locationCity && `(${group.locationCity})`}
                      </option>
                    ))}
                  </optgroup>
                )}
                {interestGroups.length > 0 && (
                  <optgroup label="Interest Communities">
                    {interestGroups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value.slice(0, 400))}
                placeholder="What's on your mind?"
                maxLength={400}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{newPostContent.length}/400</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowCreatePost(false);
                      setNewPostContent('');
                      setSelectedGroupId('');
                    }}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || !selectedGroupId}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
          <div className="flex flex-col gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Posts', icon: null },
                { key: 'local', label: 'Local Groups', icon: MapPin },
                { key: 'interest', label: 'Interest Communities', icon: Users },
                { key: 'my-posts', label: 'My Posts', icon: null }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                    activeFilter === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {Icon && <Icon size={12} />}
                  {label}
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Recent</option>
                <option value="engaged">Most Engaged</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-3xl p-8 shadow-sm max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {userJoinedGroups.length === 0 
                  ? "Welcome to your feed!" 
                  : activeFilter === 'my-posts'
                  ? "You haven't posted anything yet"
                  : "No posts to show"
                }
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {userJoinedGroups.length === 0 
                  ? "Join some groups to start seeing posts from like-minded people in your area and beyond."
                  : activeFilter === 'my-posts'
                  ? "Share your thoughts with your communities to get the conversation started."
                  : "Try adjusting your filters or join more groups to see more content."
                }
              </p>
              <button
                onClick={() => navigate('/groups')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                {userJoinedGroups.length === 0 ? 'Discover Groups' : 'Find More Groups'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => {
              const group = groups.find(g => g.id === post.groupId);
              const postComments = comments.filter(c => c.postId === post.id);
              const authorName = getUserName(post.authorId);
              const isLiked = post.likes.includes(user.id);

              return (
                <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Group Context */}
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      group?.type === 'local-meetup' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-xs font-medium text-gray-700">
                      {getGroupName(post.groupId)}
                    </span>
                    {group?.type === 'local-meetup' && group.locationCity && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={10} />
                        <span>{group.locationCity}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Post Content */}
                  <div className="p-4">
                    <PostCard
                      post={post}
                      authorName={authorName}
                      comments={postComments}
                      onLike={handleLikePost}
                      onComment={handleComment}
                      onLikeComment={handleLikeComment}
                      currentUserId={user.id}
                      getAuthorName={getUserName}
                      groupId={post.groupId}
                      isLiked={isLiked}
                      getCommentLikeStatus={(commentId) => {
                        const comment = comments.find(c => c.id === commentId);
                        return comment?.likes.includes(user.id) || false;
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
