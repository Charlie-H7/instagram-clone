drop policy if exists "Users can view their own posts" on public.posts;

create policy "Users can view their own posts"
on public.posts for select
to authenticated
using (
    (select auth.uid()) = user_id
);

-- BAD this conflicts with other policies that rely on the function can_view_post
-- drop function if exists public.can_view_post(uuid);

-- create function public.can_view_post(post_uuid uuid)
-- returns boolean
-- language sql
-- stable
-- security definer
-- set search_path = public
-- as $$
--     select exists (
--         select 1
--         from public.posts
--         join public.users
--             on public.users.id = public.posts.user_id
--         where public.posts.id = post_uuid
--         and (
--             public.users.is_private = false
--             or exists (
--                 select 1
--                 from public.following
--                 where public.following.following_id = public.posts.user_id
--                 and public.following.follower_id = (select auth.uid())
--                 and public.following.approved = true
--             )
--         )
--     );
-- $$;

-- drop policy if exists "Users can view all public account posts" on public.posts;

-- create policy "Users can view accessible posts"
-- on public.posts for select
-- to authenticated
-- using (
--     (select auth.uid()) = user_id
--     or public.can_view_post(id)
-- );

