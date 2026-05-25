drop view if exists feed_posts;

create view feed_posts as
select p.* from posts as p
join following as f on f.following_id = p.user_id -- it must be the case that the post must come from the person being followed
where (
    auth.uid() = f.follower_id -- you must be a follower
    and f.approved = true
    and p.user_id != auth.uid()
)
order by p.date desc;