
-- Create user_profiles table to store user data including selected tags
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  selected_tags TEXT[] DEFAULT '{}',
  location_city TEXT,
  location_region TEXT,
  location_coordinates JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Add Row Level Security (RLS) to ensure users can only access their own profile
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own profile
CREATE POLICY "Users can create their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own profile
CREATE POLICY "Users can delete their own profile" 
  ON public.user_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, username, selected_tags)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1), 'Anonymous'),
    '{}'
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create user profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
