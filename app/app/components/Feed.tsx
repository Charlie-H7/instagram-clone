//lowkey could just get rid of feed and make this like the home page tsx for the /app directory no??
"use client"
import { useMemo, useState } from "react"
import Image from "next/image";
import { PostRow,PostFetch } from "@/lib/posts";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function Feed({username, image_path, pfp_path, like_count}: PostFetch){
    const supabase = useMemo( () => createBrowserSupabaseClient(), []);
    // const obj = map
    // make a storage object for supabase
    // const pfp = { data: storageObj } = supabase.storage.from("pfp") -> to use state maybe (or maybe let, cant be const so  val can change)
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
        <div className="">
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
            <div className="relative w-30 h-30">
                <Image src={post_public_url} alt="Post image" fill />
            </div>
            <div className="flex flex-row">
                <div>like icon with on click</div>
                <div>{like_count}</div>
                <div>comment button</div>
                <div>Bookmark</div>
            </div>
            {/* // widget like comment + bookmark; as row
            // top comment section col */}
        </div>
    );
}