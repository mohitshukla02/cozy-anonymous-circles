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
import { ArrowLeft, Calendar, Badge, Button } from 'lucide-react';
import AdminGroupActions from '../components/AdminGroupActions';
import GroupMembersModal from '../components/GroupMembersModal';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPlanMeetupModal, setShowPlanMeetupModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

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
      
      // Check if user is a member and get their role
      const userGroups = await getUserGroups(user.id);
      const userGroup = userGroups.find(ug => ug.groupId === groupId);
      const isMember = !!userGroup;
      const isGroupAdmin = userGroup?.role === 'admin' || transformedGroup.adminId === user.id;
      
      setIsJoined(isMember);
      setIsAdmin(isGroupAdmin);

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
      await joinGroup(user.id, group.id);
      await loadGroupData(); // Reload to get updated member status
      toast({
        title: "Success",
        description: "You've joined the group!",
      });
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
      const result = await createPost({
        groupId: group.id,
        authorId: user.id,
        content,
        editedAt: undefined
      });

      if (result) {
        await loadGroupData();
        
        toast({
          title: "Success",
          description: "Post created successfully",
        });
      }
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
      await loadGroupData();
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
      await loadGroupData();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    try {
      await likeComment(commentId);
      await loadGroupData();
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

  const handleGroupDeleted = () => {
    toast({
      title: "Group Deleted",
      description: "The group has been permanently deleted.",
    });
    navigate('/groups');
  };

  const handleImageUpdated = () => {
    // Reload group data to get updated image
    loadGroupData();
  };

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  const isArchived = group.isArchived || group.status === 'archived';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header with member view button for admins */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/groups')}
            className="p-3 rounded-2xl bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                {group.name}
              </h1>
              {isArchived && (
                <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  Archived
                </Badge>
              )}
              {isAdmin && (
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                  Admin
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <button
                onClick={() => setShowMembersModal(true)}
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {group.memberIds.length} members
              </button>
              <span>•</span>
              <span>{posts.length} posts</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Plan Meetup button for local groups */}
            {isJoined && group.type === 'local-meetup' && !isArchived && (
              <Button
                onClick={() => setShowPlanMeetupModal(true)}
                size="sm"
                className="rounded-xl bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white"
              >
                <Calendar size={14} className="mr-1" />
                Plan Meetup
              </Button>
            )}

            {/* Admin Actions */}
            <AdminGroupActions
              groupId={group.id}
              groupName={group.name}
              isAdmin={isAdmin}
              currentImage={group.image}
              onGroupDeleted={handleGroupDeleted}
              onImageUpdated={handleImageUpdated}
            />
          </div>
        </div>

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
              isAdmin={isAdmin}
            />
          </>
        ) : (
          <NotMemberCard onJoin={handleJoinGroup} />
        )}

        {/* Group Members Modal */}
        <GroupMembersModal
          isOpen={showMembersModal}
          onClose={() => setShowMembersModal(false)}
          groupId={group.id}
          groupName={group.name}
          isAdmin={isAdmin}
        />

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
