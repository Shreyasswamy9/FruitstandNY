-- Storage policies for products bucket (public read)
CREATE POLICY "Public can view product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'products');

CREATE POLICY "Admins can upload product images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can update product images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can delete product images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Storage policies for tickets bucket (private)
CREATE POLICY "Users can upload to own tickets" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'tickets' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR
   EXISTS (
     SELECT 1 FROM user_profiles 
     WHERE id = auth.uid() AND is_admin = true
   ))
);

CREATE POLICY "Users can view own ticket files" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'tickets' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR
   EXISTS (
     SELECT 1 FROM user_profiles 
     WHERE id = auth.uid() AND is_admin = true
   ))
);

CREATE POLICY "Users can delete own ticket files" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'tickets' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR
   EXISTS (
     SELECT 1 FROM user_profiles 
     WHERE id = auth.uid() AND is_admin = true
   ))
);

-- Storage policies for orders bucket (private)
CREATE POLICY "Users can view own order files" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'orders' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR
   EXISTS (
     SELECT 1 FROM user_profiles 
     WHERE id = auth.uid() AND is_admin = true
   ))
);

CREATE POLICY "Admins can manage order files" 
ON storage.objects FOR ALL 
USING (
  bucket_id = 'orders' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Storage policies for avatars bucket (public read, user upload)
CREATE POLICY "Public can view avatars" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own avatar" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatar" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for admin bucket (admin only)
CREATE POLICY "Admins can manage admin files" 
ON storage.objects FOR ALL 
USING (
  bucket_id = 'admin' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);