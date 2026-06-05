"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

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
    // const { data: { user } } =  supabase.auth.getUser();

    // const follower_id = user_id;
    // const following_id = user_id;
    

    // const handleFollow = async () => {
    //     // Optimistically assume db action goes through
    //     if(!busy){
    //         setBusy(true);
    //         if(isFollowing){ // user is already following them
    //             setIsFollowing(false);
    //             const { error } = await supabase.from("following").delete().eq("following_id", following_id).eq("follower_id", follower_id);
                
    //             if(error){
    //                 setIsFollowing(true);
    //                 console.log(`Error unfollowing to db, ${error.message}`)
    //             }
    //         } else if(!isFollowing){ // user is not following them
    //             setIsFollowing(true)
    //             const { error } = await supabase
    //             .from("following")
    //             .insert({
    //                 follower_id,
    //                 following_id
    //             });

    //             if(error){
    //                 setIsFollowing(false);
    //                 console.log(`Error following to db, ${error.message}`)
    //             }
    //         }
    //         setBusy(false);
    //     }
    //     else{
    //         console.log("FOR THE LOVE OF GOD PLEASE FUCKING WAIT AND STOP SPAMMING MY FUCKING BUTTON")
    //     }
    // }
    const handleFollow = async () => {
        if (busy) return;

        setBusy(true);

        try {
            if (isFollowing) {
                // optimistic UI update
                setIsFollowing(false);

                const { error } = await supabase
                    .from("following")
                    .delete()
                    .eq("following_id", following_id)
                    .eq("follower_id", follower_id);

                // rollback if DB fails
                if (error) {
                    setIsFollowing(true);
                    console.log(`Error unfollowing to db, ${error.message}`);
                }
            } else {
                // optimistic UI update
                setIsFollowing(true);

                const { error } = await supabase
                    .from("following")
                    .insert({
                        follower_id,
                        following_id
                    });

                // rollback if DB fails
                if (error) {
                    setIsFollowing(false);
                    console.log(`Error following to db, ${error.message}`);
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
        // <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        // onClick={
        // >
        // hallo 2
        // </button>
        <div>
            {isFollowing 
            ? <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={handleFollow}>Unfollow</button> 
            : <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={handleFollow}>Follow</button>
            }
        </div>
    )
}