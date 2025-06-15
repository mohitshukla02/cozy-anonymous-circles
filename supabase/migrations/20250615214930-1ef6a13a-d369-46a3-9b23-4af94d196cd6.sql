
-- Update all local-meetup groups in Hyderabad to have RadiantTurtle945 as admin
-- First, let's find the user ID for RadiantTurtle945 and cast it to text to match admin_id type
UPDATE public.groups 
SET admin_id = (
  SELECT user_id::text 
  FROM public.user_profiles 
  WHERE username = 'RadiantTurtle945'
)
WHERE type = 'local-meetup' 
  AND location_city ILIKE '%hyderabad%'
  AND admin_id != (
    SELECT user_id::text 
    FROM public.user_profiles 
    WHERE username = 'RadiantTurtle945'
  );

-- Also update the user_groups table to set their role as admin for these groups
UPDATE public.user_groups 
SET role = 'admin'
WHERE user_id = (
  SELECT user_id::text 
  FROM public.user_profiles 
  WHERE username = 'RadiantTurtle945'
)
AND group_id IN (
  SELECT id 
  FROM public.groups 
  WHERE type = 'local-meetup' 
    AND location_city ILIKE '%hyderabad%'
);

-- If RadiantTurtle945 is not already a member of these groups, add them
INSERT INTO public.user_groups (user_id, group_id, role, anonymous_name)
SELECT 
  up.user_id::text,
  g.id,
  'admin',
  'RadiantTurtle945'
FROM public.user_profiles up
CROSS JOIN public.groups g
WHERE up.username = 'RadiantTurtle945'
  AND g.type = 'local-meetup'
  AND g.location_city ILIKE '%hyderabad%'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_groups ug 
    WHERE ug.user_id = up.user_id::text AND ug.group_id = g.id
  )
ON CONFLICT (user_id, group_id) DO UPDATE SET role = 'admin';
