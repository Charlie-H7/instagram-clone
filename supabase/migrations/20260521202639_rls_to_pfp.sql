-- alter table storage.pfp

-- Drop policies in case ran mult times!
drop policy if exists "Public read access for pfp" on storage.objects;
drop policy if exists "Authenticated users can upload files" on storage.objects;
drop policy if exists "Authenticated users can delete their own files" on storage.objects;
drop policy if exists "Users can update their own files" on storage.objects;

-- storage.foldername(name) -> {
-- [0] → pfp
-- [1] → user-id
-- [2] → avatar.png
-- }

-- Dont need select policies for public tables !!!
    -- create policy "Public read access for pfp"
    -- on storage.objects
    -- for select
    -- to public
    -- using (bucket_id = 'pfp');


-- This should only be the case for users to be able to only upload their own shit man
create policy "Authenticated users can upload files"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'pfp'
    AND auth.uid()::text = (storage.foldername(name))[1] -- This is saying ensure the uid
);


create policy "Authenticated users can delete their own files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'pfp'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- create policy "Authenticated users can delete their own files"
-- on storage.objects
-- for delete
-- to authenticated
-- using (
--     auth.uid()::text = (storage.foldername(name))[1] -- This is saying ensure the uid
-- );

create policy "Users can update their own files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'pfp'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'pfp'
  AND auth.uid()::text = (storage.foldername(name))[1]
);


-- create policy "Users can update their own image" -- realistically this one doesn't make as much sense since I would be deleting and adding new over updating
-- on storage.objects for update
-- to authenticated
-- using (auth.uid() = (storage.foldername(name))[1])
-- with check (
--     select auth.uid() = (storage.foldername(name)[1])
-- );


---------------

--  Policies for posts table 
-- create policy "Users can view post images if they" -- wow this ones a bit trickier as currently I have post viewing logic within, the table but maybe it should have gone here as opposed to here (then again the relational tables exist ther {maybe I can still access them from her})