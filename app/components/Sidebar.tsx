

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../app/components/LogoutButton";
import { Plus } from "lucide-react";
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
        <div className="min-h-screen">
            <aside className="fixed left-0 top-0 h-screen w-20 bg-gray-800 text-white p-4 flex flex-col">
                {/* <h2 className="text-2xl font-bold mb-6">Logo</h2> */}
                <Link href="/app/" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">Logo</Link>
                <nav className="space-y-2">
                    {/* <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">Search</a> */}
                    <Search />
                    {/* <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">Settings</a> */}
                    <Link href="/app/settings" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">Settings</Link>
                    <Link href={profile_path} className="block py-2.5 px-4 rounded transition hover:bg-gray-700">Profile</Link>
                    {/* <Link href */}
                    {/* need on click to pull up a screen here for creating a post, I imagine that its going to have to be like a client component */}
                    {/* <Plus /> */}
                    <CreatePost />
                </nav>

                <div className="mt-auto">
                    {/* <a href="#" className="block px-4 py-2 text-sm text-slate-400">Logout</a> */}
                    <LogoutButton />
                </div>
            </aside>
        </div>
    );
}
