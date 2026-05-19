// import { useEffect, useState } from "react";
// import { SupabaseClient, Session } from "@supabase/supabase-js";
// import { createBrowserSupabaseClient } from "@/lib/supabase/client"

// import Link from "next/link"

// // If we do the session logic within the layout it should persist.

// export default function AppPage(){
//     // On launch need to create the supabase client
//     const supabase = createBrowserSupabaseClient();
//     const session = supabase.auth.getSession();

//     // Now that I have the session;


//     return (
//         <div className="min-h-screen">
//             <aside className="fixed left-0 top-0 h-screen w-20 bg-gray-800 text-white p-4 flex flex-col">
//                 <h2 className="text-2xl font-bold mb-6">Logo</h2>
//                 <nav className="space-y-2">
//                     <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">Search</a>
//                     <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">Settings</a>
//                     <Link href="u/charlie" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">Profile</Link>
//                 </nav>

//                 <div className="mt-auto">
//                     <a href="#" className="block px-4 py-2 text-sm text-slate-400">Logout</a>
//                 </div>
//             </aside>
//         </div>
//     )
// }

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import Sidebar from "../components/Sidebar";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Not logged in?
    if (!user) {
        redirect("/");
    }

    // console.log(user);
    return (
        <div className="min-h-screen flex justify-center border border-blue-500">
            <Sidebar/>

            {/* <main className="flex-1 ml-20"> */}
            {/* <main className="flex-1 ml-20 border border-red-500"> have the main body always be center screen some fixed width of the application */}
            {/* <main className="flex-1 ml-20 border border-red-500 max-w-2xl mx-auto"> have the main body always be center screen some fixed width of the application */}
            <main>
                <div className="max-w-2xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}