
-- Enable security with explicit, safe RLS policies for core tables. Prevents unauthorized access and protects privacy. Add/adjust policies as follows:

-- --- USER PROFILES ---
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Only allow a user to select (view) their own profile
CREATE POLICY "Users can view their own profiles"
  ON user_profiles
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Only allow a user to insert their own profile (should be handled by trigger but best to be explicit)
CREATE POLICY "Users can insert their own profiles"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- --- POSTS ---
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read public posts (within a group they are a member of)
CREATE POLICY "Group members can read posts"
  ON posts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_groups ug
      WHERE ug.group_id = posts.group_id
        AND ug.user_id = auth.uid()::text
    )
  );

-- Allow only authenticated users to insert posts as themselves
CREATE POLICY "Authenticated users can create posts"
  ON posts
  FOR INSERT
  WITH CHECK (author_id = auth.uid()::text);

-- --- COMMENTS ---
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Group members can see comments on posts in groups they belong to
CREATE POLICY "Group members can read comments"
  ON comments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      JOIN user_groups ug ON posts.group_id = ug.group_id
      WHERE posts.id = comments.post_id
        AND ug.user_id = auth.uid()::text
    )
  );

-- Only authenticated users can comment as themselves
CREATE POLICY "Authenticated users can insert comments"
  ON comments
  FOR INSERT
  WITH CHECK (author_id = auth.uid()::text);

-- --- USER GROUPS ---
ALTER TABLE user_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view their user_groups membership"
  ON user_groups
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "User can insert their own user_groups row"
  ON user_groups
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- --- GROUPS ---
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Anyone can view public groups (list/search)
CREATE POLICY "Any user can view groups"
  ON groups
  FOR SELECT
  USING (TRUE);

-- Only admins can insert groups but for now: authenticated users can create groups as admins
CREATE POLICY "Authenticated users can create groups"
  ON groups
  FOR INSERT
  WITH CHECK (admin_id = auth.uid()::text);

-- --- MESSAGES ---
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Only participants (sender/recipient) can see their messages
CREATE POLICY "Participants can read messages"
  ON messages
  FOR SELECT
  USING (sender_id = auth.uid()::text OR recipient_id = auth.uid()::text);

-- Only sender can insert a message from themselves
CREATE POLICY "Users can send messages as themselves"
  ON messages
  FOR INSERT
  WITH CHECK (sender_id = auth.uid()::text);

-- --- MEETUPS + RSVPS ---
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetup_rsvps ENABLE ROW LEVEL SECURITY;

-- Anyone can view meetups
CREATE POLICY "Anyone can view meetups"
  ON meetups
  FOR SELECT
  USING (TRUE);

-- Only event creator can insert meetups
CREATE POLICY "Only creator can insert meetup"
  ON meetups
  FOR INSERT
  WITH CHECK (created_by = auth.uid()::text);

-- Only group members can RSVP
CREATE POLICY "Group members can RSVP"
  ON meetup_rsvps
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_groups ug
      WHERE ug.group_id = meetup_rsvps.meetup_id
        AND ug.user_id = auth.uid()::text
    )
  );

-- RSVPs can only be viewed by group members/RSVPing user
CREATE POLICY "Group members and RSVPing user can view RSVPs"
  ON meetup_rsvps
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meetups m
      WHERE m.id = meetup_rsvps.meetup_id
    ) AND user_id = auth.uid()::text
  );

-- --- USER INTERACTIONS ---
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view their own interactions"
  ON user_interactions
  FOR SELECT
  USING (user1_id = auth.uid()::text OR user2_id = auth.uid()::text);

CREATE POLICY "User can insert their own interactions"
  ON user_interactions
  FOR INSERT
  WITH CHECK (user1_id = auth.uid()::text OR user2_id = auth.uid()::text);

-- --- INVITATIONS ---
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view sent/received invitations"
  ON invitations
  FOR SELECT
  USING (inviter_id = auth.uid() OR invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "User can insert invitations for themselves"
  ON invitations
  FOR INSERT
  WITH CHECK (inviter_id = auth.uid());

