-- Supabase Storage Policies for Tickets Bucket
-- Run this in Supabase Dashboard → SQL Editor

-- Policy 1: Allow authenticated users to upload files to tickets bucket
CREATE POLICY "Authenticated users can upload ticket attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tickets'
);

-- Policy 2: Allow authenticated users to view files in tickets bucket
CREATE POLICY "Authenticated users can view ticket attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'tickets'
);

-- Policy 3: Allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete ticket attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'tickets'
);

-- Policy 4: Allow authenticated users to update their files
CREATE POLICY "Authenticated users can update ticket attachments"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'tickets'
)
WITH CHECK (
  bucket_id = 'tickets'
);

-- Verify policies were created
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
