
-- Create a storage bucket for group images
INSERT INTO storage.buckets (id, name, public)
VALUES ('group-images', 'group-images', true);

-- Create policy to allow authenticated users to upload group images
CREATE POLICY "Allow authenticated users to upload group images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'group-images');

-- Create policy to allow authenticated users to view group images
CREATE POLICY "Allow users to view group images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'group-images');

-- Create policy to allow authenticated users to update group images
CREATE POLICY "Allow authenticated users to update group images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'group-images');

-- Create policy to allow authenticated users to delete group images
CREATE POLICY "Allow authenticated users to delete group images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'group-images');
