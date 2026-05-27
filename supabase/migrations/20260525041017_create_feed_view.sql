drop view if exists feed_posts;

create view feed_posts as
select p.*, f.following_id from posts as p
join following as f on f.following_id = p.user_id -- it must be the case that the post must come from the person being followed
where (
    auth.uid() = f.follower_id -- you must be a follower
    and f.approved = true
    and p.user_id != auth.uid()
)
order by p.date desc;


-- drop view if exists feed_posts;

-- create view feed_posts as
-- select p.*, f.following_id, u.name, u.username, u.pfp_path from posts as p
-- join following as f on f.following_id = p.user_id
-- join users as u on u.id = f.following_id
-- where (
--     auth.uid() = f.follower_id
--     and f.approved = true
--     and p.user_id != auth.uid()
-- )
-- order by p.date desc;

-- create view feed_posts as
-- select 
--     p.*,
--     f.following_id,
--     u.name,
--     u.username,
--     u.pfp_path,
--     coalesce(lc.like_count, 0) as like_count
-- from posts as p
-- join following as f 
--     on f.following_id = p.user_id
-- join users as u 
--     on u.id = f.following_id
-- left join (
--     select post_id, count(*) as like_count
--     from likes
--     group by post_id
-- ) lc on lc.post_id = p.id
-- where (
--     auth.uid() = f.follower_id
--     and f.approved = true
--     and p.user_id != auth.uid()
-- )
-- order by p.date desc;