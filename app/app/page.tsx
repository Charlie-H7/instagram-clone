// This a server rendered component, therefore, async
import { createClient } from "@/lib/supabase/server"
import { fetchFeedPosts } from "@/lib/posts";
// import {  }

export default async function Home(){
    const supabase = await createClient();

    // const { data: profile } = await (await supabase).from("posts") // replace with a fetch helper
    const data = await fetchFeedPosts(supabase);
    console.log(data);
    return(
        <div>
            
        </div>
    )
}