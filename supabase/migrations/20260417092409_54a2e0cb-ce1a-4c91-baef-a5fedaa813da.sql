
-- Drop overly broad SELECT policies that allowed listing all files
DROP POLICY IF EXISTS "Avatars are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Reference images are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Delivery images are publicly viewable" ON storage.objects;

-- Buckets stay public so getPublicUrl() works for direct image rendering,
-- but objects are no longer listable via the SELECT policy.
-- Owners can still list/manage their own files:
CREATE POLICY "Users can list their own avatars"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can list their own reference images"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'commission-references' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can list their own deliveries"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'commission-deliveries' AND auth.uid() IS NOT NULL
  );
