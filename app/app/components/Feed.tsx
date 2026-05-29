//lowkey could just get rid of feed and make this like the home page tsx for the /app directory no??
"use client"
import { useMemo, useState } from "react"
import Image from "next/image";
import Link from "next/link";
import { PostRow,PostFetch } from "@/lib/posts";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Heart, MessageCircle } from "lucide-react";
import { unlikePost, likePost } from "@/lib/likes";

export default function Feed({id: post_id, username, image_path, pfp_path, like_count, is_liked, user_id}: PostFetch){
    const supabase = useMemo( () => createBrowserSupabaseClient(), []);
    
    const [isLiked, setLiked] = useState<boolean>(is_liked);
    const [likeCount, setLikeCount] = useState<number>(like_count);
    // const obj = map
    // make a storage object for supabase
    // const pfp = { data: storageObj } = supabase.storage.from("pfp") -> to use state maybe (or maybe let, cant be const so  val can change)

    // make state updates before async functions to prevent like the 
    async function handleLike() {
        const prev_liked = isLiked;
        const prev_like_count = likeCount;

        let error;

        // update the liked state so changes show up
        setLiked(!prev_liked);
        console.log(`state like ${isLiked}; prev_liked ${prev_liked}`);

        if (prev_liked) {
            setLikeCount(likeCount-1);
            error = await unlikePost(supabase, { user_id, post_id });
        } 
        else {
            setLikeCount(likeCount+1);
            error = await likePost(supabase, { user_id, post_id });
        }

        if(error) {setLiked(prev_liked); setLikeCount(prev_like_count)} //If there is a problem with the liked db, reset the liked status
    }


    const { data: pfp_storage_obj } = supabase.storage
    .from("pfp")
    .getPublicUrl(pfp_path)

    const { data: post_storage_obj } = supabase.storage
    .from("posts")
    .getPublicUrl(image_path)

    // if (error) console.log(error.)

    const pfp_public_url = pfp_storage_obj.publicUrl;
    const post_public_url = post_storage_obj.publicUrl;
    console.log(post_public_url)

    return(
        <div className="w-full max-w-3xl mx-auto mb-8 overflow-hidden border border-slate-200 shadow-sm">
            {/* Name + picture in row*/}

            {/* <div>{user_id}</div> */}
            {/* <div>{image_path}</div> */}
            {/* <div>{pfp_path}</div> */}
            {/* <Image src={pfp_public_url} alt={`${username} pfp`} className="w-16 h-16 rounded-full object-cover" fill/> */}
            <div className="flex flex-row items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                        src={pfp_public_url}
                        alt={`${username} pfp`}
                        fill
                        className="object-cover"
                        />
                </div>
                <div className="items-center">{username}</div>
            </div>
            {/* The best course here would be to make the table private to prevent serving images with urls but for right now you have access to all data */}
            {/* <div className="relative w-full h-[32rem] bg-slate-100"> */}
            <div className="relative w-full h-[32rem] bg-slate-100">
                {/* <Image src={post_public_url} alt="Post image" fill className="object-cover" /> */}
                <Image src={post_public_url} alt="Post image" fill className="" />
            </div>

            {/* Post widgets */}
            {/* <div className="flex flex-row gap-4 px-4 py-4 text-sm text-slate-700">
                <div>like icon with on click</div>
                <div>{like_count}</div>
                <div>comment button</div>
                <div>Bookmark</div>
            </div> */}
            {/* Post widgets */}



            {/* Updated post widgets */}

            <div className="flex flex-row gap-4 px-4 py-4 text-sm">
                {/* <div>{is_liked ? "❤️" : "🤍"}</div> */}
                <button onClick={handleLike}>
                    {isLiked ?
                        <Heart className="w-7 h-7 fill-red-500 text-primary-border hover:text-slate-100"/> :
                        <Heart className="w-7 h-7 text-primary-border hover:text-slate-100"/>
                    }
                </button>
                
                <div>{likeCount} likes</div>
                
                {/* <div>comment button</div> */}
                <Link href="/p/123">
                    <MessageCircle />
                </Link>
                <div>Comment</div>
                <div>Bookmark</div>
            </div>

            {/* // widget like comment + bookmark; as row
            // top comment section col */}
        </div>
    );
}