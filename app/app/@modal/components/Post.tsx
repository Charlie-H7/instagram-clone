// "use client"
// import { SupabaseClient } from "@supabase/supabase-js"
// import { fetchPostById } from "@/lib/posts"
// import Image from "next/image";

// type PostProps = {
//   supabase: SupabaseClient;
//   post_id: string;
// };

// export default function Post({supabase, post_id}: PostProps){
//     // could add double tap functionality later
//     const data = fetchPostById(supabase, post_id);
//     console.log(`Post.tsx ${data}`);
//     console.log(supabase);
//     // const {data: post_data} = supabase.storage.from("posts").getPublicUrl(data!.image_url);
//     // const 
//     // Select a single one from feed posts where the conditional is on post id
//     // const { data } = async () => { await supabase.from("feed_posts").select("*").eq("id", post_id)};
//     // async function fetchPost(){
//     //     const { data } = await supabase.from("feed_posts").select("*").eq("id", post_id);
//     // }
//     return(
//         <div>
//             {/* <Image src={`data`}/> */}
//             test
//         </div>
//     );

// }
// // "use client";

// // import { useEffect, useState } from "react";
// // import { SupabaseClient } from "@supabase/supabase-js";
// // import { fetchPostById } from "@/lib/posts";

// // type PostProps = {
// //   supabase: SupabaseClient;
// //   post_id: string;
// // };

// // export default function Post({ supabase, post_id }: PostProps) {
// //   const [data, setData] = useState<any>(null);

// //   useEffect(() => {
// //     if (!supabase || !post_id) return;

// //     const load = async () => {
// //       const post = await fetchPostById(supabase, post_id);
// //       setData(post);
// //     };

// //     load();
// //   }, [supabase, post_id]);

// //   console.log("render data:", data);

// //   return <div>test</div>;
// // }

"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { fetchPostById } from "@/lib/posts";
import Image from "next/image";
import CommentSection from "./CommentSection";
import { PostRow } from "@/lib/posts";

type CommentRow = {
//   id: string;
  comment: string;
  date: string;
};

type PostProps = {
  supabase: SupabaseClient;
  post_id: string;
};

// type PostProps = {
// //   supabase: SupabaseClient;
//   post_id: string;
// };

export default function Post({ supabase, post_id }: PostProps) {
// export default function Post({ post_id }: PostProps) {
  // Local state for the current post record.
    const [data, setData] = useState<Awaited<ReturnType<typeof fetchPostById>>>(null);
    const [comment, setComment] = useState<string>(""); // Used to just track the current comment on submit
    const [commentsList, setCommentList] = useState<CommentRow[]>([]); // This is used to track if multiple comments are made such that all comments made in one session go to the top
    // const supabase = useMemo(() =>createBrowserSupabaseClient(),[]);

    async function handleAddComment(e: React.FormEvent){
        e.preventDefault();
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

        /* <div className="w-full lg:w-1/2 flex flex-col bg-slate-950/90 p-4">

    {/* COMMENTS (takes remaining space, scrolls) }
    <div className="flex-1 overflow-y-auto pr-1">
        <CommentSection supabase={supabase} post_id={post_id} />
    </div>

    {/* POST INFO (always below comments) }
    <div className="shrink-0 mt-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
        <div className="text-lg font-semibold text-slate-100" tabIndex={0}>
        {data.username}
        </div>
        <p className="mt-2 text-sm text-slate-300">{data.caption}</p>
    </div>

    </div> */
    const public_post_url = post_storage_obj.publicUrl;

    return (
        <div className="max-w-5xl w-full h-[80vh] relative flex flex-col lg:flex-row overflow-hidden rounded-3xl bg-slate-950/80 shadow-xl">
        <div className="w-full lg:w-1/2 relative min-h-[22rem] aspect-square">
            <Image src={public_post_url} fill alt={`Post by ${data.username}`} className="object-cover" />
        </div>

            {/* Here */}

            <div className="w-full lg:w-1/2 flex flex-col bg-slate-950/90 p-4">
            {/* HERE */}
            {/* {commentsList ? commentsList.map((comment) => (
                // <div key={}>
                <div >
                    <div>{comment.date}</div>
                    <div>{comment.comment}</div>
                </div>
                )): (null)} */}
            {/* HERE */}
            {/* COMMENTS (takes remaining space, scrolls) */}
            <div className="flex-1 overflow-y-auto pr-1">
                <div className="space-y-4 pb-4">
                    {commentsList ? commentsList.map((comment) => (
                    // <div key={}>
                    <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                        <div>{comment.date}</div>
                        <div>{comment.comment}</div>
                    </div>
                    )): (null)}
                </div>
                {/* <CommentSection supabase={supabase} post_id={post_id} /> */}
                <CommentSection post_id={post_id} />
            </div>

            {/* POST INFO (always below comments) */}
            <div className="shrink-0 mt-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                {/* <div className="text-lg font-semibold text-slate-100">
                {data.username}
                </div>
                <p className="mt-2 text-sm text-slate-300">{data.caption}</p> */}
                <form onSubmit={handleAddComment}>
                    <textarea placeholder="Write a comment..." className="w-full" onChange={(e)=>{setComment(e.target.value);}}></textarea>
                    <button type="submit">Post</button>
                </form>
            </div>

            </div>


        </div>
    );
}
// To do
// 1. on submit send to db
// 2. default for page (non modal to work) => should be the same thing for now (this method of comments is temporary as I'm not to sure on the approach for timers)
// 3. infinite scroll on Posts