
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Settings, Plus, TrendingUp, MessageCircle, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Group, Post, Comment } from '../types/groups';
import { getGroupById, getPostsByGroup, createPost, getCommentsByPost, createComment, likePost, likeComment, getUserGroups } from '../utils/supabaseStorage';
import PostCard from '../components/PostCard';
import { Badge } from '../components/ui/badge';
import { TAG_CATEGORIES } from '../types/tags';

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'liked' | 'discussed'>('recent');
  const [isJoined, setIsJoined] = useState(false);

  const tagNames = new Map();
  TAG_CATEGORIES.forEach(category => {
    category.tags.forEach(tag => {
      tagNames.set(tag.id, tag.name);
    });
  });

  useEffect(() => {
    if (!user || !groupId) {
      navigate('/groups');
      return;
    }

    loadGroupData();
  }, [user, groupId, navigate]);

  const loadGroupData = async () => {
    if (!groupId || !user) return;

    try {
      const foundGroup = await getGroupById(groupId);
      
      if (!foundGroup) {
        navigate('/groups');
        return;
      }

      setGroup(foundGroup);
      
      // Check if user is a member
      const userGroups = await getUserGroups(user.id);
      const isMember = userGroups.some(ug => ug.groupId === groupId);
      setIsJoined(isMember);

      if (isMember) {
        const allPosts = await getPostsByGroup(groupId);
        const allComments: Comment[] = [];
        
        for (const post of allPosts) {
          const postComments = await getCommentsByPost(post.id);
          allComments.push(...postComments);
        }
        
        setPosts(allPosts);
        setComments(allComments);
      }
    } catch (error) {
      console.error('Error loading group data:', error);
      navigate('/groups');
    }
  };

  const getUserName = (userId: string): string => {
    // For now return a placeholder - in a real app you'd get this from user_groups table
    return 'Anonymous User';
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !group || !newPostContent.trim()) return;

    try {
      await createPost({
        groupId: group.id,
        authorId: user.id,
        content: newPostContent.trim(),
        editedAt: undefined
      });

      setNewPostContent('');
      loadGroupData(); // Reload data
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;

    try {
      await likePost(postId);
      loadGroupData(); // Reload data
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    if (!user || !group) return;

    try {
      await createComment({
        postId,
        authorId: user.id,
        content
      });
      loadGroupData(); // Reload data
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    try {
      await likeComment(commentId);
      loadGroupData(); // Reload data
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

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

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Modern Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/groups')}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200 hover:shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">
              {group.name}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {group.memberIds.length} members • {getSortedPosts().length} posts
            </p>
          </div>
        </div>

        {/* Group Info Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100/50 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
          <div className="relative">
            <p className="text-gray-700 text-sm mb-4 leading-relaxed">{group.description}</p>
            
            <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Users size={14} />
                <span>{group.memberIds.length}/{group.memberLimit} members</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>Created {new Date(group.createdDate).toLocaleDateString()}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {group.tags.map(tagId => (
                <Badge 
                  key={tagId} 
                  variant="outline" 
                  className="text-xs px-2 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-0 font-medium"
                >
                  {tagNames.get(tagId)}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {isJoined ? (
          <>
            {/* Create Post Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100/50 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
              <div className="relative">
                <form onSubmit={handleCreatePost}>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value.slice(0, 500))}
                    placeholder="Share your thoughts..."
                    maxLength={500}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-400">
                      {newPostContent.length}/500
                    </span>
                    <button
                      type="submit"
                      disabled={!newPostContent.trim()}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                    >
                      <Plus size={14} />
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex gap-2 mb-6">
              {[
                { key: 'recent', label: 'Recent', icon: TrendingUp },
                { key: 'liked', label: 'Liked', icon: Heart },
                { key: 'discussed', label: 'Discussed', icon: MessageCircle }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key as any)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    sortBy === key
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm'
                      : 'bg-white/80 text-gray-600 hover:bg-white border border-gray-200/50 hover:shadow-sm'
                  }`}
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {getSortedPosts().length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle size={24} className="text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                        No posts yet
                      </h3>
                      <p className="text-gray-600 text-xs">
                        Be the first to start a conversation!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                getSortedPosts().map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    authorName={getUserName(post.authorId)}
                    comments={comments.filter(c => c.postId === post.id)}
                    onLike={handleLikePost}
                    onComment={handleComment}
                    onLikeComment={handleLikeComment}
                    currentUserId={user.id}
                    getAuthorName={getUserName}
                    groupId={group.id}
                    isLiked={post.likes.includes(user.id)}
                    getCommentLikeStatus={(commentId) => {
                      const comment = comments.find(c => c.id === commentId);
                      return comment?.likes.includes(user.id) || false;
                    }}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100/50 max-w-sm mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={24} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  Join to participate
                </h3>
                <p className="text-gray-600 text-xs mb-4">
                  Become a member to view posts and join discussions.
                </p>
                <button
                  onClick={() => navigate('/groups')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Back to Groups
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;
