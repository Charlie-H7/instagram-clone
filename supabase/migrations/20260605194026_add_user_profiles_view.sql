-- Ok so this should do the following

-- join users on following and get if they are being followed
drop view if exists user_profiles;

-- create view user_profiles as
-- select id from users as u
-- coalesce(if.is_following, false) as is_following,

--     exists (
--         select 1
--         from following f
--         where f.following_id = 
--     )

-- left join following as f on 
-- u.id = f.following and auth.uid() = f.follower_id


create view user_profiles as
select
  u.id,
  u.username,
  u.name,
  u.bio,
  u.pfp_path,

  exists (
    select 1
    from following f
    where f.follower_id = auth.uid()
    and f.following_id = u.id
  ) as is_following

from users u;