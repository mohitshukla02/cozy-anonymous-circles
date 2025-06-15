
-- Enable RLS and policies for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;

CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON public.user_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS and policies for groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view open groups" ON public.groups;
DROP POLICY IF EXISTS "Users can create groups" ON public.groups;
DROP POLICY IF EXISTS "Group admins can update their groups" ON public.groups;

CREATE POLICY "Anyone can view open groups"
  ON public.groups FOR SELECT
  USING (privacy = 'open' OR admin_id = auth.uid()::text);

CREATE POLICY "Users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid()::text = admin_id);

CREATE POLICY "Group admins can update their groups"
  ON public.groups FOR UPDATE
  USING (auth.uid()::text = admin_id);

-- Enable RLS and policies for user_groups
ALTER TABLE public.user_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their group memberships" ON public.user_groups;
DROP POLICY IF EXISTS "Users can join groups" ON public.user_groups;

CREATE POLICY "Users can view their group memberships"
  ON public.user_groups FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can join groups"
  ON public.user_groups FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Enable RLS and policies for posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Group members can view posts" ON public.posts;
DROP POLICY IF EXISTS "Group members can create posts" ON public.posts;

CREATE POLICY "Group members can view posts"
  ON public.posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_groups 
      WHERE user_id = auth.uid()::text AND group_id = posts.group_id
    )
  );

CREATE POLICY "Group members can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (
    auth.uid()::text = author_id AND
    EXISTS (
      SELECT 1 FROM public.user_groups 
      WHERE user_id = auth.uid()::text AND group_id = posts.group_id
    )
  );

-- Enable RLS and policies for comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Group members can view comments" ON public.comments;
DROP POLICY IF EXISTS "Group members can create comments" ON public.comments;

CREATE POLICY "Group members can view comments"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      JOIN public.user_groups ug ON ug.group_id = p.group_id
      WHERE p.id = comments.post_id AND ug.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Group members can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid()::text = author_id AND
    EXISTS (
      SELECT 1 FROM public.posts p
      JOIN public.user_groups ug ON ug.group_id = p.group_id
      WHERE p.id = comments.post_id AND ug.user_id = auth.uid()::text
    )
  );

-- Enable RLS and policies for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their received messages" ON public.messages;

CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT
  USING (auth.uid()::text = sender_id OR auth.uid()::text = recipient_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid()::text = sender_id);

CREATE POLICY "Users can update their received messages"
  ON public.messages FOR UPDATE
  USING (auth.uid()::text = recipient_id);

-- Enable RLS and policies for user_interactions
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view interactions in their groups" ON public.user_interactions;
DROP POLICY IF EXISTS "Users can create interactions" ON public.user_interactions;

CREATE POLICY "Users can view interactions in their groups"
  ON public.user_interactions FOR SELECT
  USING (auth.uid()::text = user1_id OR auth.uid()::text = user2_id);

CREATE POLICY "Users can create interactions"
  ON public.user_interactions FOR INSERT
  WITH CHECK (auth.uid()::text = user1_id);

-- Enable RLS and policies for meetups
ALTER TABLE public.meetups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view meetups in their groups" ON public.meetups;
DROP POLICY IF EXISTS "Group members can create meetups" ON public.meetups;
DROP POLICY IF EXISTS "Meetup creators can update their meetups" ON public.meetups;

CREATE POLICY "Users can view meetups in their groups"
  ON public.meetups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_groups 
      WHERE user_id = auth.uid()::text AND group_id = meetups.group_id
    )
  );

CREATE POLICY "Group members can create meetups"
  ON public.meetups FOR INSERT
  WITH CHECK (
    auth.uid()::text = created_by AND
    EXISTS (
      SELECT 1 FROM public.user_groups 
      WHERE user_id = auth.uid()::text AND group_id = meetups.group_id
    )
  );

CREATE POLICY "Meetup creators can update their meetups"
  ON public.meetups FOR UPDATE
  USING (auth.uid()::text = created_by);

-- Enable RLS and policies for meetup_rsvps
ALTER TABLE public.meetup_rsvps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view RSVPs for meetups they can see" ON public.meetup_rsvps;
DROP POLICY IF EXISTS "Users can manage their own RSVPs" ON public.meetup_rsvps;

CREATE POLICY "Users can view RSVPs for meetups they can see"
  ON public.meetup_rsvps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.meetups m
      JOIN public.user_groups ug ON ug.group_id = m.group_id
      WHERE m.id = meetup_rsvps.meetup_id AND ug.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage their own RSVPs"
  ON public.meetup_rsvps FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Enable RLS and policies for invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own sent invitations" ON public.invitations;
DROP POLICY IF EXISTS "Users can create their own invitations" ON public.invitations;
DROP POLICY IF EXISTS "Users can update their own invitations" ON public.invitations;

CREATE POLICY "Users can view their own sent invitations"
  ON public.invitations FOR SELECT
  USING (auth.uid() = inviter_id);

CREATE POLICY "Users can create their own invitations"
  ON public.invitations FOR INSERT
  WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update their own invitations"
  ON public.invitations FOR UPDATE
  USING (auth.uid() = inviter_id);

-- Add content length constraints for main user input tables
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_content_length;
ALTER TABLE public.posts ADD CONSTRAINT posts_content_length CHECK (length(content) <= 500);

ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_content_length;
ALTER TABLE public.comments ADD CONSTRAINT comments_content_length CHECK (length(content) <= 500);

ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_content_length;
ALTER TABLE public.messages ADD CONSTRAINT messages_content_length CHECK (length(content) <= 500);

-- Enforce valid email on invitations
ALTER TABLE public.invitations DROP CONSTRAINT IF EXISTS invitations_invitee_email_format;
ALTER TABLE public.invitations ADD CONSTRAINT invitations_invitee_email_format CHECK (invitee_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
