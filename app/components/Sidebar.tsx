

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../app/components/LogoutButton";
import { Settings, User, Home } from "lucide-react";
import Search from "../app/components/Search"

import CreatePost from "./CreatePost";
/*
The Server Component is the “cheat code”

Server Components are the ONLY place where this is allowed:

wait for data
→ THEN render UI
→ THEN send to browser

So instead of:

“fix timing in browser”

you actually do:

“move timing to server”
*/

// The main point of this is to have a sidebar that ROUTES (or not but is an option)
export default async function Sidebar( { /*username*/ } ){
    const supabase = await createClient();
    // const { user } = await supabase.auth.getUser();
    // const { data: user } = await supabase.auth.getUser();
    const { data } = await supabase.auth.getUser();
    // const user_id = data.user?.id


    const { data: profile, error } = await supabase.from("users").select("username,name").eq("id", data.user?.id).single();
    if(error) {
        console.log(error.message)
        // Maybe return to login to get correc session
    }
    

    const profile_path = `/app/u/${data.user?.id}`;
        
    return(
        <div className="min-h-screen z-50">
            {/* <aside className="fixed md:bottom-0 left-0 top-0 h-screen w-20 bg-gray-800 text-white p-4 flex flex-col"> */}
            <aside className="
                fixed bottom-0 left-0 w-full h-16
                flex flex-row items-center justify-around
                md:top-0 md:left-0 md:h-screen md:w-20
                md:flex-col md:justify-start
                bg-gray-800 text-white p-4 
            ">
                {/* TODO: Design a logo and replace it with component '<Home />' if I don't feel lazy*/}
                {/* <h2 className="text-2xl font-bold mb-6">Logo</h2> */}
                <Link href="/app/" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">
                    <Home size={20}/>
                </Link>
                    <Search />
                    <Link href="/app/settings" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">
                        <Settings size={20}/>
                    </Link>
                    <Link href={profile_path} className="block py-2.5 px-4 rounded transition hover:bg-gray-700">
                        <User size={20}/>
                    </Link>
                    <CreatePost />
                <div className="hidden md:block md:mt-auto">
                    <LogoutButton />
                </div>
            </aside>
        </div>
    );
}
