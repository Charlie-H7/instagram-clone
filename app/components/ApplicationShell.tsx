"use client"

import { useEffect, useState, useMemo } from "react";

import AuthPanel from "../components/AuthPanel"
// import Application from "./Application"
import { useRouter } from "next/navigation";


import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import{ Session } from "@supabase/supabase-js";
// const [supabaseClient, setSupabaseClient] = useState<any>(null); Something is wrong with this, syntax

// Need to make new projects

export default function ApplicationShell() {
    const router = useRouter();
    const supabase = useMemo(() => createBrowserSupabaseClient(), [])
    const [session, setSession] = useState<Session | null>(null);
    // const [ authLoading, setAuthLoading ] = useState(true);
    const [authLoading, setAuthLoading] = useState(() => supabase !== null);

    // So Im thinking that i need a useEffect on this page on the dependency on either client or session
    /* It should 
    1. Check if there is a current clientsupabase or session
    2. verify that
    3. CLEANUP: cancel it, and get rid of the client (to go back to auth)
    */
    useEffect(()=> {
        if (!supabase) {
            return;
        }

        let cancelled = false;

        // void supabase.auth.getSession().then(({data})) => {
        void supabase.auth.getSession().then(({ data }) => {
            if (cancelled) {
                return;
            }
            setSession(data.session);
            setAuthLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (cancelled) {
                return;
            }
            setSession(session);
        });

        return () => {
            cancelled = true;
            authListener.subscription.unsubscribe();
        }

    },[supabase])

        useEffect(() => {
            if (session) {
                router.push("/app"); // THIS IS THE IMPORTANT REROUTING
            }
        }, [session, router]);
    
        if(session) {
            // return(<div>This is the application screen</div>); <app would have been here>
            // router.push("/feed");
            return(null);
        }
//             return(
//                 <div className="min-h-screen">
//     <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white p-4 flex flex-col">
//         <h2 className="text-2xl font-bold mb-6">Logo</h2>

//         <nav className="space-y-2">
//             <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">
//                 Dashboard
//             </a>

//             <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">
//                 Settings
//             </a>

//             <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">
//                 Profile
//             </a>
//         </nav>

//         <div className="mt-auto">
//             <a href="#" className="block px-4 py-2 text-sm text-slate-400">
//                 Logout
//             </a>
//         </div>
//     </aside>
// </div>
//             )
//             <div className="flex min-h-screen">
//     <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
//         <h2 className="text-2xl font-bold mb-6">Logo</h2>

//         <nav className="space-y-2">
//             <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">
//                 Dashboard
//             </a>

//             <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">
//                 Settings
//             </a>

//             <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">
//                 Profile
//             </a>
//         </nav>

//         <div className="mt-auto">
//             <a href="#" className="block px-4 py-2 text-sm text-slate-400">
//                 Logout
//             </a>
//         </div>
//     </aside>
// </div>                
            // <div className="flex min-h-screen">
            //         <aside className="w-64 bg-gray-800 text-white p-4">
            //             <h2 className="text-2xl font-bold mb-6">Logo</h2>
            //             <nav className="space-y-2">
            //             <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">Dashboard</a>
            //             <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">Settings</a>
            //             <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-gray-700">Profile</a>
            //             </nav>
            //                 <div className="mt-auto">
            //                     <a href="#" className="block px-4 py-2 text-sm text-slate-400">Logout</a>
            //                 </div>
            //         </aside>
            //     </div>
            
         
        else if(authLoading){
            return(<div>Loading session</div>)    
        }
        else{
            console.log("hallo");
            return (
                <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
                    <AuthPanel supabase={supabase} session={session} authLoading={authLoading} />
                </div>
            );
        }
        // if (!session){
        //     return (
        //         <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        //             <AuthPanel supabase={supabase} session={session} authLoading={authLoading} />
        //         </div>
        //     );
        // }
        // else if(authLoading){
        //     return(<div>Loading session</div>)
        // }
        // else{
        //     //Load application
        //     return(<div>This is the application screen</div>);
        // }

        // its bad to default to show screen first
        // assume that theres a session first as otherwise there
        
}