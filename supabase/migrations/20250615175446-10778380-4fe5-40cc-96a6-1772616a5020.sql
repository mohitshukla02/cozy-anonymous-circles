
-- Allow post author to update/delete their posts
CREATE POLICY "Authors can update their posts"
  ON public.posts FOR UPDATE
  USING (auth.uid()::text = author_id);

CREATE POLICY "Authors can delete their posts"
  ON public.posts FOR DELETE
  USING (auth.uid()::text = author_id);

-- Allow comment author to update/delete their comments
CREATE POLICY "Authors can update their comments"
  ON public.comments FOR UPDATE
  USING (auth.uid()::text = author_id);

CREATE POLICY "Authors can delete their comments"
  ON public.comments FOR DELETE
  USING (auth.uid()::text = author_id);

-- Allow user to delete their group membership
CREATE POLICY "Users can leave groups"
  ON public.user_groups FOR DELETE
  USING (auth.uid()::text = user_id);

-- Allow admin to delete group
CREATE POLICY "Group admins can delete their groups"
  ON public.groups FOR DELETE
  USING (auth.uid()::text = admin_id);
