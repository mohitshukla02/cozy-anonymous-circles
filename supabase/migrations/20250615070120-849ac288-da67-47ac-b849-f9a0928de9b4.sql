
-- Create invitations table to track user invitations
CREATE TABLE public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invitee_email TEXT NOT NULL,
  invitation_token UUID NOT NULL DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster lookups
CREATE INDEX idx_invitations_inviter_id ON public.invitations(inviter_id);
CREATE INDEX idx_invitations_token ON public.invitations(invitation_token);
CREATE INDEX idx_invitations_email ON public.invitations(invitee_email);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for invitations
CREATE POLICY "Users can view their own sent invitations" 
  ON public.invitations 
  FOR SELECT 
  USING (auth.uid() = inviter_id);

CREATE POLICY "Users can create their own invitations" 
  ON public.invitations 
  FOR INSERT 
  WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update their own invitations" 
  ON public.invitations 
  FOR UPDATE 
  USING (auth.uid() = inviter_id);

-- Function to get remaining invites for current month
CREATE OR REPLACE FUNCTION get_remaining_invites_for_user(user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  used_invites INTEGER;
  monthly_limit INTEGER := 5;
BEGIN
  -- Count invitations sent this month
  SELECT COUNT(*)
  INTO used_invites
  FROM public.invitations
  WHERE inviter_id = user_id
    AND created_at >= date_trunc('month', now())
    AND created_at < date_trunc('month', now()) + INTERVAL '1 month';
  
  RETURN GREATEST(0, monthly_limit - used_invites);
END;
$$;

-- Function to check if user can send invitation
CREATE OR REPLACE FUNCTION can_send_invitation(user_id UUID, email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  remaining_invites INTEGER;
  existing_invite_count INTEGER;
  existing_user_count INTEGER;
BEGIN
  -- Check remaining invites for this month
  SELECT get_remaining_invites_for_user(user_id) INTO remaining_invites;
  
  IF remaining_invites <= 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Check if email is already invited by this user (pending invitations)
  SELECT COUNT(*)
  INTO existing_invite_count
  FROM public.invitations
  WHERE inviter_id = user_id
    AND invitee_email = email
    AND status = 'pending'
    AND expires_at > now();
    
  IF existing_invite_count > 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user with this email already exists
  SELECT COUNT(*)
  INTO existing_user_count
  FROM auth.users
  WHERE auth.users.email = email;
    
  IF existing_user_count > 0 THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;
