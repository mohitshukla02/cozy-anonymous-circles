
-- First create the groups table and related structures
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  member_ids TEXT[] NOT NULL DEFAULT '{}',
  created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  member_limit INTEGER NOT NULL DEFAULT 50,
  privacy TEXT NOT NULL DEFAULT 'open' CHECK (privacy IN ('open', 'invitation')),
  admin_id TEXT NOT NULL,
  avatar TEXT,
  pinned_post_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('interest', 'local-meetup')),
  location_city TEXT,
  location_region TEXT,
  location_lat FLOAT,
  location_lng FLOAT,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  meetup_deadline TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'warning', 'final_warning', 'archived'))
);

-- Create user_groups table for group memberships
CREATE TABLE public.user_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  join_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  anonymous_name TEXT NOT NULL,
  UNIQUE(user_id, group_id)
);

-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  likes TEXT[] NOT NULL DEFAULT '{}',
  edited_at TIMESTAMP WITH TIME ZONE
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  likes TEXT[] NOT NULL DEFAULT '{}'
);

-- Create messages table for direct messaging
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  group_context_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  CONSTRAINT messages_content_length CHECK (length(content) <= 500)
);

-- Create user interactions table to track eligibility for messaging
CREATE TABLE public.user_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id TEXT NOT NULL,
  user2_id TEXT NOT NULL,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'comment')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id, group_id, interaction_type)
);

-- Create meetups table for tracking group meetups
CREATE TABLE public.meetups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'confirmed', 'completed', 'cancelled'))
);

-- Create meetup RSVPs table
CREATE TABLE public.meetup_rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meetup_id UUID NOT NULL REFERENCES public.meetups(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'interested' CHECK (status IN ('interested', 'attending', 'not_attending')),
  checked_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(meetup_id, user_id)
);

-- Function to update meetup deadline for local groups
CREATE OR REPLACE FUNCTION update_meetup_deadline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'local-meetup' AND NEW.meetup_deadline IS NULL THEN
    NEW.meetup_deadline := NEW.created_date + INTERVAL '4 weeks';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set meetup deadline on group creation
CREATE TRIGGER set_meetup_deadline
  BEFORE INSERT ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION update_meetup_deadline();

-- Function to reset meetup deadline after successful meetup
CREATE OR REPLACE FUNCTION reset_group_timer()
RETURNS TRIGGER AS $$
BEGIN
  -- Reset timer when meetup is marked as completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE public.groups 
    SET meetup_deadline = now() + INTERVAL '4 weeks',
        last_activity = now(),
        status = 'active'
    WHERE id = NEW.group_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to reset group timer after successful meetup
CREATE TRIGGER reset_group_timer_trigger
  AFTER UPDATE ON public.meetups
  FOR EACH ROW
  EXECUTE FUNCTION reset_group_timer();

-- Enable RLS on all tables
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetup_rsvps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups
CREATE POLICY "Anyone can view open groups" 
  ON public.groups 
  FOR SELECT 
  USING (privacy = 'open');

CREATE POLICY "Users can create groups" 
  ON public.groups 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = admin_id);

CREATE POLICY "Group admins can update their groups" 
  ON public.groups 
  FOR UPDATE 
  USING (auth.uid()::text = admin_id);

-- RLS Policies for user_groups
CREATE POLICY "Users can view their group memberships" 
  ON public.user_groups 
  FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can join groups" 
  ON public.user_groups 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

-- RLS Policies for posts
CREATE POLICY "Group members can view posts" 
  ON public.posts 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_groups 
      WHERE user_id = auth.uid()::text AND group_id = posts.group_id
    )
  );

CREATE POLICY "Group members can create posts" 
  ON public.posts 
  FOR INSERT 
  WITH CHECK (
    auth.uid()::text = author_id AND
    EXISTS (
      SELECT 1 FROM public.user_groups 
      WHERE user_id = auth.uid()::text AND group_id = posts.group_id
    )
  );

-- RLS Policies for comments
CREATE POLICY "Group members can view comments" 
  ON public.comments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      JOIN public.user_groups ug ON ug.group_id = p.group_id
      WHERE p.id = comments.post_id AND ug.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Group members can create comments" 
  ON public.comments 
  FOR INSERT 
  WITH CHECK (
    auth.uid()::text = author_id AND
    EXISTS (
      SELECT 1 FROM public.posts p
      JOIN public.user_groups ug ON ug.group_id = p.group_id
      WHERE p.id = comments.post_id AND ug.user_id = auth.uid()::text
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid()::text = sender_id OR auth.uid()::text = recipient_id);

CREATE POLICY "Users can send messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = sender_id);

CREATE POLICY "Users can update their received messages" 
  ON public.messages 
  FOR UPDATE 
  USING (auth.uid()::text = recipient_id);

-- RLS Policies for user interactions
CREATE POLICY "Users can view interactions in their groups" 
  ON public.user_interactions 
  FOR SELECT 
  USING (auth.uid()::text = user1_id OR auth.uid()::text = user2_id);

CREATE POLICY "Users can create interactions" 
  ON public.user_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user1_id);

-- RLS Policies for meetups
CREATE POLICY "Users can view meetups in their groups" 
  ON public.meetups 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_groups 
      WHERE user_id = auth.uid()::text AND group_id = meetups.group_id
    )
  );

CREATE POLICY "Group members can create meetups" 
  ON public.meetups 
  FOR INSERT 
  WITH CHECK (
    auth.uid()::text = created_by AND
    EXISTS (
      SELECT 1 FROM public.user_groups 
      WHERE user_id = auth.uid()::text AND group_id = meetups.group_id
    )
  );

CREATE POLICY "Meetup creators can update their meetups" 
  ON public.meetups 
  FOR UPDATE 
  USING (auth.uid()::text = created_by);

-- RLS Policies for meetup RSVPs
CREATE POLICY "Users can view RSVPs for meetups they can see" 
  ON public.meetup_rsvps 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.meetups m
      JOIN public.user_groups ug ON ug.group_id = m.group_id
      WHERE m.id = meetup_rsvps.meetup_id AND ug.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage their own RSVPs" 
  ON public.meetup_rsvps 
  FOR ALL 
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
