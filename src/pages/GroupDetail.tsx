
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Settings, Plus } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Group, Post, Comment } from '../types/groups';
import { getGroups, getPosts, savePosts, getComments, saveComments, getUserGroups, generateAnonymousName } from '../utils/groupStorage';
import PostCard from '../components/PostCard';
import { Badge } from '../components/ui/badge';
import { TAG_CATEGORIES } from '../types/tags';

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
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

    const groups = getGroups();
    const foundGroup = groups.find(g => g.id === groupId);
    
    if (!foundGroup) {
      navigate('/groups');
      return;
    }

    setGroup(foundGroup);
    setIsJoined(foundGroup.memberIds.includes(user.username));

    const allPosts = getPosts().filter(p => p.groupId === groupId);
    const allComments = getComments();
    
    setPosts(allPosts);
    setComments(allComments);
  }, [user, groupId, navigate]);

  const getUserName = (userId: string, groupId: string): string => {
    const userGroups = getUserGroups();
    const userGroup = userGroups.find(ug => ug.userId === userId && ug.groupId === groupId);
    return userGroup?.anonymousName || generateAnonymousName(userId, groupId);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !group || !newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      groupId: group.id,
      authorId: user.username,
      content: newPostContent.trim(),
      timestamp: new Date().toISOString(),
      likes: []
    };

    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    savePosts([...getPosts().filter(p => p.groupId !== group.id), ...updatedPosts]);
    setNewPostContent('');
  };

  const handleLikePost = (postId: string) => {
    if (!user) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(user.username);
        return {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== user.username)
            : [...post.likes, user.username]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    savePosts([...getPosts().filter(p => p.groupId !== group?.id), ...updatedPosts]);
  };

  const handleComment = (postId: string, content: string) => {
    if (!user || !group) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      authorId: user.username,
      content,
      timestamp: new Date().toISOString(),
      likes: []
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    saveComments(updatedComments);
  };

  const handleLikeComment = (commentId: string) => {
    if (!user) return;

    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        const isLiked = comment.likes.includes(user.username);
        return {
          ...comment,
          likes: isLiked 
            ? comment.likes.filter(id => id !== user.username)
            : [...comment.likes, user.username]
        };
      }
      return comment;
    });

    setComments(updatedComments);
    saveComments(updatedComments);
  };

  const handleReply = (parentCommentId: string, content: string) => {
    if (!user || !group) return;

    const parentComment = comments.find(c => c.id === parentCommentId);
    if (!parentComment) return;

    const newReply: Comment = {
      id: Date.now().toString(),
      postId: parentComment.postId,
      authorId: user.username,
      content,
      timestamp: new Date().toISOString(),
      likes: [],
      parentCommentId
    };

    const updatedComments = [...comments, newReply];
    setComments(updatedComments);
    saveComments(updatedComments);
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
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/groups')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-heading font-bold text-gray-800">
            {group.name}
          </h1>
        </div>

        {/* Group Info */}
        <div className="bg-white rounded-3xl p-6 shadow-soft mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <p className="text-gray-600 mb-4">{group.description}</p>
              
              <div className="flex items-center gap-6 mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{group.memberIds.length}/{group.memberLimit} members</span>
                </div>
                <span>Created {new Date(group.createdDate).toLocaleDateString()}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.tags.map(tagId => (
                  <Badge key={tagId} variant="outline" className="text-xs">
                    {tagNames.get(tagId)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {isJoined && (
                <button className="text-gray-600 hover:text-gray-800 transition-colors">
                  <Settings size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {isJoined ? (
          <>
            {/* Create Post */}
            <div className="bg-white rounded-3xl p-6 shadow-soft mb-6">
              <form onSubmit={handleCreatePost}>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value.slice(0, 500))}
                  placeholder="Share your thoughts with the group..."
                  maxLength={500}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    {newPostContent.length}/500 characters
                  </span>
                  <button
                    type="submit"
                    disabled={!newPostContent.trim()}
                    className="bg-amber-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Post
                  </button>
                </div>
              </form>
            </div>

            {/* Sort Options */}
            <div className="flex gap-2 mb-6">
              {[
                { key: 'recent', label: 'Recent' },
                { key: 'liked', label: 'Most Liked' },
                { key: 'discussed', label: 'Most Discussed' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === key
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {getSortedPosts().length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white rounded-3xl p-8 shadow-soft">
                    <h3 className="font-heading font-semibold text-gray-800 mb-2">
                      No posts yet
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Be the first to start a conversation in this group!
                    </p>
                  </div>
                </div>
              ) : (
                getSortedPosts().map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    authorName={getUserName(post.authorId, group.id)}
                    comments={comments.filter(c => c.postId === post.id)}
                    onLike={handleLikePost}
                    onComment={handleComment}
                    onLikeComment={handleLikeComment}
                    onReply={handleReply}
                    currentUserId={user.username}
                    getUserName={getUserName}
                    groupId={group.id}
                    isLiked={post.likes.includes(user.username)}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-3xl p-8 shadow-soft max-w-md mx-auto">
              <h3 className="font-heading font-semibold text-gray-800 mb-2">
                Join this group to participate
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                You need to be a member to view posts and join discussions.
              </p>
              <button
                onClick={() => navigate('/groups')}
                className="bg-amber-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors"
              >
                Back to Groups
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;
