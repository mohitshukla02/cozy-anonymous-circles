
-- Track when a user sends a message
CREATE TABLE public.message_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.message_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own message sends"
  ON public.message_sends
  FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own message sends"
  ON public.message_sends
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Track when a user creates a group
CREATE TABLE public.group_creations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.group_creations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own group creations"
  ON public.group_creations
  FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own group creations"
  ON public.group_creations
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Track when a user creates a post or comment
CREATE TABLE public.content_creations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.content_creations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own content creations"
  ON public.content_creations
  FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own content creations"
  ON public.content_creations
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
