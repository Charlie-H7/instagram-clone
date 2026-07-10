"use client"

import { useState, useMemo } from "react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { followUser } from "@/lib/supabase/followUsers";
import { unfollowUser } from "@/lib/supabase/unfollowUser";

type FollowingButtonProps = {
    is_following: boolean,
     follower_id: string,
     following_id: string
}


export default function FollowButton({is_following, follower_id, following_id}: FollowingButtonProps){
// export default function FollowButton(is_following: boolean){
    const supabase = useMemo(() => createBrowserSupabaseClient(),[]);
    const [isFollowing, setIsFollowing] = useState<boolean>(is_following);
    const [busy, setBusy] = useState<boolean>(false);

    console.log(follower_id);
    // might just need to get the user directly might be something diff

    const handleFollow = async () => {
        if (busy) return;

        setBusy(true);
        try {
            if (isFollowing) {
                // optimistic UI update
                setIsFollowing(false);
                try {
                    await unfollowUser(supabase, follower_id, following_id);
                } catch (error) {
                    console.error("Error unfollowing user:", error); // lol does this even work
                    setIsFollowing(true);
                }
            } else {
                // optimistic UI update
                setIsFollowing(true);
                try {
                    await followUser(supabase, follower_id, following_id);
                } catch (error) {
                    console.error("Error following user:", error);
                    setIsFollowing(false);
                }
            }
        } catch (err) {
            // catches unexpected crashes (network failure, runtime error, etc.)
            console.error("Unexpected error in follow handler:", err);
        } finally {
            // ALWAYS runs, no matter what
            setBusy(false);
        }
    };

    return(
        <div>
            {isFollowing 
            ? <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={handleFollow}>Unfollow</button> 
            : <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={handleFollow}>Follow</button>
            }
        </div>
    )
}