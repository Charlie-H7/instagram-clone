drop policy if exists "Users can upload own post images" 
on storage.objects;

drop policy if exists "Users can delete own post images"
on storage.objects;

create policy "Users can upload own post images"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'posts'
    and auth.uid()::text = (storage.foldername(name))[1] -- posts/auth.uid(this is [1])/randid
);

create policy "Users can delete own post images" -- Not impl yet
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'posts'
    and auth.uid()::text = (storage.foldername(name))[1]
);