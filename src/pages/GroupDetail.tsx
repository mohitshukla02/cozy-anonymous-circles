
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Group, Post, Comment } from '../types/groups';
import { getGroupById, getPostsByGroup, createPost, getCommentsByPost, createComment, likePost, likeComment, getUserGroups, joinGroup } from '../utils/supabaseStorage';
import GroupHeader from '../components/group-detail/GroupHeader';
import GroupInfoCard from '../components/group-detail/GroupInfoCard';
import CreatePostCard from '../components/group-detail/CreatePostCard';
import PostsSection from '../components/group-detail/PostsSection';
import NotMemberCard from '../components/group-detail/NotMemberCard';
import MeetupManager from '../components/MeetupManager';
import MeetupWarningBanner from '../components/MeetupWarningBanner';
import PlanMeetupModal from '../components/PlanMeetupModal';
import { useToast } from '../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'liked' | 'discussed'>('recent');
  const [isJoined, setIsJoined] = useState(false);
  const [showPlanMeetupModal, setShowPlanMeetupModal] = useState(false);

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
      // Get group data directly from Supabase with warning level
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError || !groupData) {
        navigate('/groups');
        return;
      }

      // Transform the group data to match our interface
      const transformedGroup: Group = {
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
        image: groupData.avatar,
        tags: groupData.tags,
        memberIds: groupData.member_ids,
        createdDate: groupData.created_date,
        memberLimit: groupData.member_limit,
        privacy: groupData.privacy as 'open' | 'invitation',
        adminId: groupData.admin_id,
        type: groupData.type as 'interest' | 'local-meetup',
        locationCity: groupData.location_city,
        locationRegion: groupData.location_region,
        isArchived: groupData.status === 'archived',
        meetupDeadline: groupData.next_meetup_deadline,
        warning_level: groupData.warning_level as 'none' | 'week2' | 'week1' | 'final',
        status: groupData.status as 'active' | 'warning' | 'final_warning' | 'archived'
      };

      setGroup(transformedGroup);
      
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

  const handleJoinGroup = async () => {
    if (!user || !group) return;

    try {
      const success = await joinGroup(user.id, group.id);
      if (success) {
        await loadGroupData(); // Reload to get updated member status
        toast({
          title: "Success",
          description: "You've joined the group!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to join group. It may be at capacity.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive",
      });
    }
  };

  const handleCreatePost = async (content: string) => {
    if (!user || !group) return;

    try {
      await createPost({
        groupId: group.id,
        authorId: user.id,
        content,
        editedAt: undefined
      });

      loadGroupData();
      
      toast({
        title: "Success",
        description: "Post created successfully",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error", 
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;

    try {
      await likePost(postId);
      loadGroupData();
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
      loadGroupData();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    try {
      await likeComment(commentId);
      loadGroupData();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const getCommentLikeStatus = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    return comment?.likes.includes(user?.id || '') || false;
  };

  const handleMeetupCreated = () => {
    // Reload group data to get updated warning levels
    loadGroupData();
    setShowPlanMeetupModal(false);
  };

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const isArchived = group.isArchived || group.status === 'archived';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <GroupHeader
          groupName={group.name}
          isArchived={isArchived}
          memberCount={group.memberIds.length}
          postCount={posts.length}
          isJoined={isJoined}
          isLocalGroup={group.type === 'local-meetup'}
          onPlanMeetup={() => setShowPlanMeetupModal(true)}
        />

        {/* Meetup Warning Banner for local groups */}
        {isJoined && group.type === 'local-meetup' && group.meetupDeadline && (
          <MeetupWarningBanner
            warningLevel={group.warning_level || 'none'}
            nextDeadline={group.meetupDeadline}
            onPlanMeetup={() => setShowPlanMeetupModal(true)}
            isArchived={isArchived}
          />
        )}

        {/* Group Info Card */}
        <GroupInfoCard group={group} isArchived={isArchived} />

        {isJoined ? (
          <>
            {/* Meetup Manager for local groups */}
            {group.type === 'local-meetup' && (
              <MeetupManager
                groupId={group.id}
                groupName={group.name}
                currentUserId={user.id}
                isLocalGroup={true}
              />
            )}

            {/* Create Post Card - disabled if archived */}
            {!isArchived && (
              <CreatePostCard
                userId={user.id}
                groupId={group.id}
                onCreatePost={handleCreatePost}
              />
            )}

            {/* Posts Section */}
            <PostsSection
              posts={posts}
              comments={comments}
              sortBy={sortBy}
              onSortChange={setSortBy}
              currentUserId={user.id}
              groupId={group.id}
              onLike={handleLikePost}
              onComment={handleComment}
              onLikeComment={handleLikeComment}
              getCommentLikeStatus={getCommentLikeStatus}
              isArchived={isArchived}
            />
          </>
        ) : (
          <NotMemberCard onJoin={handleJoinGroup} />
        )}

        {/* Plan Meetup Modal */}
        <PlanMeetupModal
          isOpen={showPlanMeetupModal}
          onClose={() => setShowPlanMeetupModal(false)}
          groupId={group.id}
          groupName={group.name}
          onMeetupCreated={handleMeetupCreated}
        />
      </div>
    </div>
  );
};

export default GroupDetail;
