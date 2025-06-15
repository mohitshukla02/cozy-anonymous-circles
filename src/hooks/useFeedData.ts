
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Post, Comment, UserGroup, Group } from '../types/groups';
import { getUserGroups, getPostsByGroup, getCommentsByPost, likePost, likeComment, getGroupById } from '../utils/supabaseStorage';

export const useFeedData = () => {
  const { user } = useAuth();
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

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

  return {
    userGroups,
    groups,
    allPosts,
    allComments,
    loading,
    handleLikePost,
    handleComment,
    handleLikeComment,
    user
  };
};
