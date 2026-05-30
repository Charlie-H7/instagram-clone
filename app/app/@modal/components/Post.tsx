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
import { PostRow } from "@/lib/posts";

type PostProps = {
supabase: SupabaseClient;
post_id: string;
};

export default function Post({ supabase, post_id }: PostProps) {
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

const { data: post_storage_obj } = supabase.storage
.from("posts")
.getPublicUrl(data.image_path)

const public_post_url = post_storage_obj.publicUrl;

    // console.log(`Post.tsx ${data.id}`);
console.log(data);

return (
    <div>
        <Image src={public_post_url} fill alt="tk"/>
    </div>
);
}