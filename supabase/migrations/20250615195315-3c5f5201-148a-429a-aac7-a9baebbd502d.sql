
-- Update groups table to properly handle meetup deadlines and warning levels
UPDATE public.groups 
SET next_meetup_deadline = created_date + INTERVAL '28 days',
    warning_level = 'none'
WHERE type = 'local-meetup' AND next_meetup_deadline IS NULL;

-- Create function to update RSVP and checkin counts on meetups table
CREATE OR REPLACE FUNCTION update_meetup_counts()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update RSVP count
  UPDATE public.meetups 
  SET rsvp_count = (
    SELECT COUNT(*) FROM public.meetup_rsvps 
    WHERE meetup_id = COALESCE(NEW.meetup_id, OLD.meetup_id) 
    AND status IN ('attending', 'interested')
  ),
  checkin_count = (
    SELECT COUNT(*) FROM public.meetup_rsvps 
    WHERE meetup_id = COALESCE(NEW.meetup_id, OLD.meetup_id) 
    AND checked_in = true
  )
  WHERE id = COALESCE(NEW.meetup_id, OLD.meetup_id);
  
  -- Check if meetup should be marked as successful (3+ check-ins)
  IF NEW.checked_in = true AND OLD.checked_in = false THEN
    UPDATE public.meetups 
    SET status = 'successful'
    WHERE id = NEW.meetup_id 
    AND (SELECT COUNT(*) FROM public.meetup_rsvps WHERE meetup_id = NEW.meetup_id AND checked_in = true) >= 3
    AND status = 'planned';
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for meetup counts
DROP TRIGGER IF EXISTS meetup_rsvp_counts_trigger ON public.meetup_rsvps;
CREATE TRIGGER meetup_rsvp_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.meetup_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_meetup_counts();

-- Update the group timer reset function to work with successful status
DROP TRIGGER IF EXISTS meetup_success_trigger ON public.meetups;
CREATE OR REPLACE FUNCTION reset_group_timer_on_meetup_success()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- When a meetup is marked as successful, reset the group's timer
  IF NEW.status = 'successful' AND OLD.status != 'successful' THEN
    UPDATE public.groups 
    SET 
      last_successful_meetup = now(),
      next_meetup_deadline = now() + INTERVAL '28 days',
      warning_level = 'none',
      status = 'active'
    WHERE id = NEW.group_id;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER meetup_success_trigger
  AFTER UPDATE ON public.meetups
  FOR EACH ROW
  EXECUTE FUNCTION reset_group_timer_on_meetup_success();

-- Create function to update interaction counts when posts/comments are liked
CREATE OR REPLACE FUNCTION track_like_interaction()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  post_author_id text;
  comment_author_id text;
  group_context_id uuid;
BEGIN
  -- Handle post likes
  IF TG_TABLE_NAME = 'posts' THEN
    -- Get the post author and group
    SELECT author_id, group_id INTO post_author_id, group_context_id
    FROM public.posts WHERE id = NEW.id;
    
    -- Track interactions for each user who liked the post
    INSERT INTO public.user_interactions (user1_id, user2_id, group_id, interaction_type)
    SELECT unnest(NEW.likes) as liker_id, post_author_id, group_context_id, 'like'
    WHERE unnest(NEW.likes) != post_author_id
    ON CONFLICT (user1_id, user2_id, group_id, interaction_type) DO NOTHING;
  END IF;
  
  -- Handle comment likes  
  IF TG_TABLE_NAME = 'comments' THEN
    -- Get the comment author and group context
    SELECT c.author_id, p.group_id INTO comment_author_id, group_context_id
    FROM public.comments c
    JOIN public.posts p ON c.post_id = p.id
    WHERE c.id = NEW.id;
    
    -- Track interactions for each user who liked the comment
    INSERT INTO public.user_interactions (user1_id, user2_id, group_id, interaction_type)
    SELECT unnest(NEW.likes) as liker_id, comment_author_id, group_context_id, 'like'
    WHERE unnest(NEW.likes) != comment_author_id
    ON CONFLICT (user1_id, user2_id, group_id, interaction_type) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create triggers for like tracking
DROP TRIGGER IF EXISTS track_post_likes_trigger ON public.posts;
CREATE TRIGGER track_post_likes_trigger
  AFTER UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION track_like_interaction();

DROP TRIGGER IF EXISTS track_comment_likes_trigger ON public.comments;  
CREATE TRIGGER track_comment_likes_trigger
  AFTER UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION track_like_interaction();

-- Create function to track comment interactions
CREATE OR REPLACE FUNCTION track_comment_interaction()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  post_author_id text;
  group_context_id uuid;
BEGIN
  -- Get the post author and group context
  SELECT p.author_id, p.group_id INTO post_author_id, group_context_id
  FROM public.posts p
  WHERE p.id = NEW.post_id;
  
  -- Track comment interaction
  INSERT INTO public.user_interactions (user1_id, user2_id, group_id, interaction_type)
  VALUES (NEW.author_id, post_author_id, group_context_id, 'comment')
  ON CONFLICT (user1_id, user2_id, group_id, interaction_type) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for comment tracking
DROP TRIGGER IF EXISTS track_comment_interaction_trigger ON public.comments;
CREATE TRIGGER track_comment_interaction_trigger
  AFTER INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION track_comment_interaction();
