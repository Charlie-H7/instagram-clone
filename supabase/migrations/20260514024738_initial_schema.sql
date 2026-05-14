-- Imports
create extension if not exists pgcrypto;

drop function if exists public.can_view_post(uuid);
-- https://supabase.com/docs/guides/local-development?utm_source=chatgpt.com
-- If you wanna do it locally


-- Tables
CREATE TABLE if not exists public.users(
    -- id uuid PRIMARY KEY default gen_random_uuid(),
    id uuid PRIMARY KEY REFERENCES auth.users(id) on delete cascade, -- auth.users is the table that supabase creates to store user info, by referencing it we can link our users to the auth system and also ensure that if a user is deleted from auth.users they will be deleted from our users table as well
    name TEXT not null,
    username TEXT unique not null,
    bio TEXT,
    is_private boolean not null default false,
    created timestamptz not null default now()
);

CREATE TABLE if not exists public.posts(
    id uuid PRIMARY KEY default gen_random_uuid(),
    -- maybe would need like a thing for photos, a cdn??
    user_id uuid not null REFERENCES public.users(id) on delete cascade, -- this means if a user is deleted all their posts will be deleted as well
    caption TEXT not null,
    image_path TEXT not null, -- A image is required for each post
    date timestamptz not null default now()
);

CREATE TABLE if not exists public.comments(
    id uuid PRIMARY KEY default gen_random_uuid(),
    post_id uuid not null REFERENCES public.posts(id) on delete cascade,
    user_id uuid not null REFERENCES public.users(id) on delete cascade,
    parent_comment_id uuid REFERENCES public.comments(id) on delete cascade,
    comment TEXT not null,
    date timestamptz not null default now()
);

-- Relational
create table if not exists public.following (
    follower_id uuid not null references public.users(id) on delete cascade, -- user becomes folower of following_id
    following_id uuid not null references public.users(id) on delete cascade,
    approved boolean not null default false, -- Used to check for private accounts, following logic IF account is private
    primary key (follower_id, following_id),

    check (follower_id <> following_id) -- this check ensures that a user can't follow themselves
);

-- Does this prevent users from liking their own photos / others liking a photo multiple time
CREATE TABLE if not exists public.likes(
    user_id uuid not null REFERENCES public.users(id) on delete cascade,
    post_id uuid not null REFERENCES public.posts(id) on delete cascade,
    PRIMARY KEY (user_id, post_id) -- this composite primary key ensures that a user
    -- id uuid PRIMARY KEY default gen_random_uuid(),
    -- post_id uuid REFERENCES public.posts (id) on delete cascade,
    -- user_id uuid REFERENCES public.users (id) on delete cascade
    -- user_id uuid REFRENCES public.users (id), UNIQUE would this prevent it
);

-- Helper
-- decides if users can view a post if
-- 1. they are public
-- 2. if they are the poster
-- 3. OR they are private and are a follower

create function public.can_view_post(post_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.posts
        join public.users
            on public.users.id = public.posts.user_id
        where public.posts.id = post_uuid
        and (
            public.users.is_private = false

            or public.posts.user_id = (select auth.uid())

            or exists (
                select 1
                from public.following
                where public.following.following_id = public.posts.user_id
                and public.following.follower_id = (select auth.uid())
                and public.following.approved = true
            )
        )
    );
$$;

revoke all on function public.can_view_post(uuid) from public;
grant execute on function public.can_view_post(uuid) to authenticated;


-- Indices
create index if not exists posts_user_id_idx
on public.posts (user_id, date desc);

create index if not exists comments_post_id_idx
on public.comments (post_id, date asc);

create index if not exists likes_post_id_idx
on public.likes (post_id);

create index if not exists following_lookup_idx
on public.following (following_id, follower_id);


revoke all on public.posts from public;
grant select, insert, update, delete on public.posts to authenticated;
-- You see I don't know If i need a table for user pass inclusive in users (although I doubt it since that seems pretty unsafe)

-- Now that I defined my tables I can ideally create a bunch of policies "Policies are Postgres's rule engine."
-- https://supabase.com/docs/guides/database/postgres/row-level-security
alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- RLS for relational db
 -- Since these are just backend managed relationships; only worry about users adding and removing their own relations
 alter table public.following enable row level security;
 alter table public.likes enable row level security;


-- Before creating policies; make sure you drop them in case they already exist
    -- users
drop policy if exists "Profiles are viewable by all users" on public.users;
drop policy if exists "Users can create a profile" on public.users;
drop policy if exists "Users can update their own profile" on public.users;
drop policy if exists "Users can delete their own profile" on public.users;

-- Posts
drop policy if exists "Users can view all public account posts" on public.posts;
drop policy if exists "Users can create posts" on public.posts;
drop policy if exists "Users can delete their own posts" on public.posts;

-- Comments 
drop policy if exists "Users can view approved comments" on public.comments;
drop policy if exists "Users can submit their own comments" on public.comments;
drop policy if exists "Users can delete their own comments" on public.comments;
drop policy if exists "Users can update their own comments" on public.comments;

-- relational
drop policy if exists "Users can view follows" on public.following;
drop policy if exists "Users can follow others" on public.following;
drop policy if exists "Users can unfollow" on public.following;
drop policy if exists "Users can view likes on visible posts" on public.likes;
drop policy if exists "Users can like posts" on public.likes;
drop policy if exists "Users can unlike posts" on public.likes;

-- Policies
create policy "Profiles are viewable by all users"
on public.users for select
to authenticated
using (true); -- this means that any authenticated user can view the users table


-- Featureauth.uid() = user_id(select auth.uid()) = user_idExecutionOften runs for every rowRuns once and caches the resultSpeedCan be slow on large tablesSignificantly faster/optimized
-- auth.uid() = user_id: This is a direct function call. In many cases, PostgreSQL will re-evaluate this function for every single row processed in your query. If your table has 100,000 rows, the database may call the authentication check 100,000 times, which can turn a fast query into one that takes several seconds.(select auth.uid()) = user_id: Wrapping the function in a subquery (specifically an InitPlan) tells the PostgreSQL optimizer to run the function exactly once at the beginning of the query, cache the resulting ID, and then reuse that fixed value for every row comparison. This is a Supabase-recommended optimization that can reduce overhead from seconds to
create policy "Users can create a profile"
on public.users for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.users for update
to authenticated
using((select auth.uid()) = id)  -- checks if the existing row complies with the policy expression
with check ( (select auth.uid()) = id); -- checks if the new row complies with the policy expression

create policy "Users can delete their own profile"
on public.users for delete
to authenticated
using((select auth.uid()) = id); -- //CHECK IF ID HERE COMES FROM THE INDEXING LIKE ON THEIR FILE IUADIBFIDJBFBSDBFDHBFBD



-- posts
create policy "Users can view all public account posts"
on public.posts for select
to authenticated
using (public.can_view_post(id));

-- im starting to be less and less sure about the using lines i feel like the 'id' is supposed to be representative of the user_id foriegn WITHIN ITS OWN TABLE and the only reason they used 'id' is because of indexing
create policy "Users can create posts"
on public.posts for insert
to authenticated
with check ((select auth.uid()) = user_id); -- user_id is self referential to own table in scope

create policy "Users can delete their own posts"
on public.posts for delete
to authenticated
using ((select auth.uid()) = user_id);

-- honestly who care about update dont let em screw em lol

-- COMMENTS

create policy "Users can view approved comments"
on public.comments for select
to authenticated
using (public.can_view_post(post_id));

create policy "Users can submit their own comments"
on public.comments for insert
to authenticated
with check ((select auth.uid()) = user_id
    and public.can_view_post(post_id));

create policy "Users can delete their own comments"
on public.comments for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can update their own comments"
on public.comments for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Relational policies
create policy "Users can view follows"
on public.following for select
to authenticated
using (true);

create policy "Users can follow others"
on public.following for insert
to authenticated
with check ((select auth.uid()) = follower_id);

create policy "Users can unfollow"
on public.following for delete
to authenticated
using ((select auth.uid()) = follower_id);

create policy "Users can view likes on visible posts"
on public.likes for select
to authenticated
using (public.can_view_post(post_id));

create policy "Users can like posts"
on public.likes for insert
to authenticated
with check ((select auth.uid()) = user_id
    and public.can_view_post(post_id));

create policy "Users can unlike posts"
on public.likes for delete
to authenticated
using ((select auth.uid()) = user_id);

-- Things for the future
-- 3. Figure out how images are stored on supabase, make related changes to the posts table

