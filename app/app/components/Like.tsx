"use client"
import { useState } from "react"
import { SupabaseClient } from "@supabase/supabase-js"
import { unlikePost, likePost } from "@/lib/likes";
import { Heart } from "lucide-react";

type LikeProps = {
    supabase: SupabaseClient;
    post_id: string;
    like_count: number;
    initial_liked: boolean;
}

export default function PostLikeButton( {supabase, post_id, like_count, initial_liked}: LikeProps){
    const [likeCount, setLikeCount] = useState<number>(like_count);
    const [isLiked, setIsLiked] = useState<boolean>(initial_liked);
    

        // make state updates before async functions to prevent like the 
        async function handleLike() {
            const user_id = (await supabase.auth.getUser()).data.user?.id
            if (!user_id){
                return; // ideally reroute for home
            }
            const prev_liked = isLiked;
            const prev_like_count = likeCount;
    
            let error;
    
            // update the liked state so changes show up
            setIsLiked(!prev_liked);
            console.log(`state like ${isLiked}; prev_liked ${prev_liked}`);
    
            if (prev_liked) {
                setLikeCount(likeCount-1);
                error = await unlikePost(supabase, { user_id, post_id });
            } 
            else {
                setLikeCount(likeCount+1);
                error = await likePost(supabase, { user_id, post_id });
            }
    
            if(error) {setIsLiked(prev_liked); setLikeCount(prev_like_count)} //If there is a problem with the liked db, reset the liked status
        }

    return(
        <div className="flex flex-row gap-4 items-center text-sm">
            <button onClick={handleLike}>
                {isLiked ?
                    <Heart className="w-7 h-7 fill-red-500 text-primary-border hover:text-slate-100"/> :
                    <Heart className="w-7 h-7 text-primary-border hover:text-slate-100"/>
                }
            </button>
            
            <div>{likeCount} likes</div>
        </div>
    );
}