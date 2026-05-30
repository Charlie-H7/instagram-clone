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


// So need to make modal scroll on sm: so that I can actually see the comments on small screen... or is there a better way for this maybe like not the moda version if on sm:??
// Also need to make the comment segment overflow so you can scroll and load more/not show all the comments for a post. (perhaps will need infinite scroll in multiple places... here and for the posts)
return (
    // <div className="flex flex-0 flex-row">
    <div className="max-w-5xl w-full h-[80vh] relative flex flex-col lg:flex-row flex-none">
        {/* <div className="max-w-2xl w-full relative aspect-square"> */}
        <div className="w-2/3 lg:w-1/2 relative aspect-square">
            <Image src={public_post_url} fill alt={`Post by ${data.username}`}/>
        </div>
        <div className="w-1/2 lg:w-1/2 bg-primary">Comment here</div>
    </div>
);
}