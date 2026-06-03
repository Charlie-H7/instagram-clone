// This a server rendered component, therefore, async
import { createClient } from "@/lib/supabase/server"
import { fetchFeedPosts } from "@/lib/posts";
import Feed from "./components/Feed";

// import {  }

export default async function Home(){
    const supabase = await createClient();

    // const { data: profile } = await (await supabase).from("posts") // replace with a fetch helper
    const data = await fetchFeedPosts(supabase);
    const { data: user_data } = await supabase.auth.getUser();
    const user_id = user_data.user!.id;

    console.log(data);
    console.log("/app");
    return(
        // <div className="flex flex-col flex-0 justify-center items-center gap-2 w-full bg-red-500">
        // <div className="flex flex-col flex-0 justify-center items-center gap-2 w-full ">
        <div className="flex flex-col flex-none justify-center items-center gap-2 max-w-4xl w-full ">
            {/* max-w-[630px] */}
            {/* {data?.map( (entry) => (<Feed key={entry.id} username={entry.username} user_id={entry.user_id} image_path={entry.image_path}/>) */}
            <Feed />
        </div>
    )
}