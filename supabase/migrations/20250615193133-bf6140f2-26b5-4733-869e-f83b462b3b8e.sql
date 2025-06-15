
-- Add notifications table (new)
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  payload JSONB,
  read_at TIMESTAMP WITH TIME ZONE,
  channel TEXT NOT NULL DEFAULT 'in-app' CHECK (channel IN ('in-app', 'push', 'email')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add notification preferences table (new)
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  meetup_notifications TEXT NOT NULL DEFAULT 'push' CHECK (meetup_notifications IN ('push', 'email', 'silent')),
  rsvp_notifications TEXT NOT NULL DEFAULT 'in-app' CHECK (rsvp_notifications IN ('push', 'email', 'silent')),
  warning_notifications TEXT NOT NULL DEFAULT 'push' CHECK (warning_notifications IN ('push', 'email', 'silent')),
  recap_notifications TEXT NOT NULL DEFAULT 'in-app' CHECK (recap_notifications IN ('push', 'email', 'silent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add meetup recap posts table (new)
CREATE TABLE public.meetup_recaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meetup_id UUID NOT NULL REFERENCES public.meetups(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(meetup_id, user_id)
);

-- Update groups table to add meetup tracking fields (new columns)
ALTER TABLE public.groups 
ADD COLUMN IF NOT EXISTS last_successful_meetup TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS next_meetup_deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS warning_level TEXT DEFAULT 'none' CHECK (warning_level IN ('none', 'week2', 'week1', 'final'));

-- Update existing meetups table to add missing fields
ALTER TABLE public.meetups 
ADD COLUMN IF NOT EXISTS rsvp_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS checkin_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS purpose TEXT NOT NULL DEFAULT 'coffee',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Update groups table to set initial deadlines for local-meetup groups
UPDATE public.groups 
SET next_meetup_deadline = created_date + INTERVAL '28 days',
    warning_level = 'none'
WHERE type = 'local-meetup' AND next_meetup_deadline IS NULL;

-- Add RLS policies for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (
  user_id = auth.uid()::text
);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (
  user_id = auth.uid()::text
);

-- Add RLS policies for notification preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notification preferences" ON public.notification_preferences FOR ALL USING (
  user_id = auth.uid()::text
);

-- Add RLS policies for meetup recaps
ALTER TABLE public.meetup_recaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view recaps for meetups in their groups" ON public.meetup_recaps FOR SELECT USING (
  meetup_id IN (
    SELECT m.id FROM public.meetups m 
    JOIN public.user_groups ug ON m.group_id = ug.group_id 
    WHERE ug.user_id = auth.uid()::text
  )
);
CREATE POLICY "Users can create their own recaps" ON public.meetup_recaps FOR INSERT WITH CHECK (
  user_id = auth.uid()::text
);

-- Create function to update group warning levels
CREATE OR REPLACE FUNCTION update_group_warning_levels()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update warning levels based on time remaining
  UPDATE public.groups 
  SET warning_level = CASE 
    WHEN next_meetup_deadline <= now() + INTERVAL '2 days' THEN 'final'
    WHEN next_meetup_deadline <= now() + INTERVAL '7 days' THEN 'week1'
    WHEN next_meetup_deadline <= now() + INTERVAL '14 days' THEN 'week2'
    ELSE 'none'
  END
  WHERE type = 'local-meetup' 
    AND status = 'active'
    AND next_meetup_deadline IS NOT NULL;
  
  -- Archive groups that have passed their deadline
  UPDATE public.groups 
  SET status = 'archived'
  WHERE type = 'local-meetup' 
    AND status = 'active'
    AND next_meetup_deadline < now();
END;
$$;

-- Create function to reset group timer after successful meetup
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

-- Create trigger for meetup success
DROP TRIGGER IF EXISTS meetup_success_trigger ON public.meetups;
CREATE TRIGGER meetup_success_trigger
  AFTER UPDATE ON public.meetups
  FOR EACH ROW
  EXECUTE FUNCTION reset_group_timer_on_meetup_success();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_groups_warning_level ON public.groups(warning_level);
CREATE INDEX IF NOT EXISTS idx_groups_next_deadline ON public.groups(next_meetup_deadline);
CREATE INDEX IF NOT EXISTS idx_meetup_recaps_meetup_id ON public.meetup_recaps(meetup_id);
