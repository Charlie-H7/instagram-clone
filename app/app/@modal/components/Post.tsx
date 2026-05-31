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

import { useEffect, useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { fetchPostById } from "@/lib/posts";
import Image from "next/image";
import CommentSection from "./CommentSection";
import { PostRow } from "@/lib/posts";

type PostProps = {
  supabase: SupabaseClient;
  post_id: string;
};

export default function Post({ supabase, post_id }: PostProps) {
  // Local state for the current post record.
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchPostById>>>(null);

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

        {/* COMMENTS (takes remaining space, scrolls) */}
        <div className="flex-1 overflow-y-auto pr-1">
            <CommentSection supabase={supabase} post_id={post_id} />
        </div>

        {/* POST INFO (always below comments) */}
        <div className="shrink-0 mt-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
            {/* <div className="text-lg font-semibold text-slate-100">
            {data.username}
            </div>
            <p className="mt-2 text-sm text-slate-300">{data.caption}</p> */}
            <form>
                <textarea placeholder="Write a comment..." className="w-full"></textarea>
                <button type="submit">Post</button>
            </form>
        </div>

        </div>


    </div>
  );
}
