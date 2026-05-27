// This a server rendered component, therefore, async
import { createClient } from "@/lib/supabase/server"
import { fetchFeedPosts } from "@/lib/posts";
import Feed from "./components/Feed";

// import {  }

export default async function Home(){
    const supabase = await createClient();

    // const { data: profile } = await (await supabase).from("posts") // replace with a fetch helper
    const data = await fetchFeedPosts(supabase);
    console.log(data);
    console.log("/app");
    return(
        <div className="flex flex-col flex-0 justify-center items-center gap-2">
            
            {data?.map( (entry) => (<Feed key={entry.id} user_id={entry.user_id} image_path={entry.image_path}/>)
            // widget like comment + bookmark; as row
            // top comment section col
            )}
        </div>
    )
}