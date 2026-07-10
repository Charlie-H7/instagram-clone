"use client";

import { useEffect, useState, useMemo } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { fetchPostById } from "@/lib/posts";
import Image from "next/image";
import CommentSection from "./CommentSection";
import { addNewComment } from "@/lib/comments"; // pushes new comment to the database

type CommentRow = {
//   id: string;
  comment: string;
  date: string;
};

type PostProps = {
  post_id: string;
};

export default function Post({ post_id }: PostProps) {
// export default function Post({ post_id }: PostProps) {
  // Local state for the current post record.
    const [data, setData] = useState<Awaited<ReturnType<typeof fetchPostById>>>(null);
    const [comment, setComment] = useState<string>(""); // Used to just track the current comment on submit
    const [commentsList, setCommentList] = useState<CommentRow[]>([]); // This is used to track if multiple comments are made such that all comments made in one session go to the top
    const supabase = useMemo(() =>createBrowserSupabaseClient(),[]);


    async function handleAddComment(e: React.FormEvent){
        e.preventDefault();
        // const {data: {user: {id: user_id}}}} = await supabase.auth.getUser();
        const {data: {user}} = await supabase.auth.getUser()
        const user_id = user?.id;

        // on submit of form
        // extend the list of the shit (actually newest one should be at the top so place comment at [0])
        // setCommentList([...commentsList, ...comment])
        setCommentList((prev) => [
        {
            comment,
            date: new Date().toISOString(),
        },
        ...prev,
        ]);



        if (!user_id) {
            throw new Error("User not authenticated");
            // redirect, to '/' later
        }


        const error = await addNewComment(supabase, {post_id, user_id, comment})
        if(error) console.log(error.message);
    }

    useEffect(() => {
        if (!supabase || !post_id) return;

        const load = async () => {
        const post = await fetchPostById(supabase, post_id);
        setData(post);
        };

        load();
    }, [supabase, post_id]);

    if (!data) return <div>Loading...</div>;

    // Build the public image URL for the post image.
    const { data: post_storage_obj } = supabase.storage
        .from("posts")
        .getPublicUrl(data.image_path);

    const public_post_url = post_storage_obj.publicUrl;

    return (
        <div className="max-w-5xl w-full h-[80vh] relative flex flex-col lg:flex-row overflow-hidden rounded-3xl bg-slate-950/80 shadow-xl">
            <div className="w-full lg:w-1/2 relative min-h-[22rem] aspect-square">
                <Image src={public_post_url} fill alt={`Post by ${data.username}`} className="object-cover" />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col bg-slate-950/90 p-4">
                {/* Comments You Create */}
                <div className="flex-1 overflow-y-auto pr-1">
                    <div className="space-y-4 pb-4">
                        {commentsList ? commentsList.map((comment) => (
                        <div key={(crypto.randomUUID())} className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                            <div>{comment.date}</div>
                            <div>{comment.comment}</div>
                        </div>
                        )): (null)}
                    </div>
                    {/* Fetches comments from Supabase: Infinite Scroll */}
                    <CommentSection post_id={post_id} />
                </div>
                {/* Comment Form */}
                <div className="shrink-0 mt-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                    <form onSubmit={handleAddComment}>
                        <textarea required placeholder="Write a comment..." className="w-full" onChange={(e)=>{setComment(e.target.value);}}></textarea>
                        <button type="submit">Post</button>
                    </form>
                </div>
            </div>
        </div>
    );
}