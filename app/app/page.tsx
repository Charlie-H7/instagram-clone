// This a server rendered component, therefore, async
import { createClient } from "@/lib/supabase/server"
import { fetchFeedPosts } from "@/lib/posts";
import Feed from "./components/Feed";


export default async function Home(){
    const supabase = await createClient();
    const data = await fetchFeedPosts(supabase);
    
    // Fetches the feed for the home page
    return(
        <div className="">
            {/* <div className="flex flex-col gap-2 justify-center items-center max-w-md lg:max-w-xl w-full mx-auto border-4 border-blue-500"> */}
            <div className="flex flex-col gap-2 justify-center items-center max-w-md lg:max-w-xl w-full mx-auto">
                <Feed />
            </div>
        </div>
    )
}