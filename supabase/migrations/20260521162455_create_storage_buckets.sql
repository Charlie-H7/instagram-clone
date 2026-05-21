insert into storage.buckets (id, name, public)
values
    ('pfp', 'pfp', true),
    ('posts', 'posts', false); -- posts shouldn't be publicly accessable (there are rules like on who can view what) -> do I need to make a policy??
