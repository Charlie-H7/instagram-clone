"use client"

import { useMemo, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Search as SearchIcon } from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"


export default function Search(){
    const supabase = useMemo(() => (createBrowserSupabaseClient()), []);
    const [query, setQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any[]>([]); // For now; get a type later after I know what data im fetching
    const [open, setOpen] = useState<boolean>(false);
    
    //Okay so i need an async function for querying useEffect -> calls it



    useEffect (() => {
        // const fetchSearch = async () => { // need to set a timer instead for debounce
        const timerSearch = setTimeout(async () => { // Make a fetch here on supabase based on 'query that is updated'
            const { data } = await supabase.from("users").select("*").ilike('username', `%${query}%`).limit(5); // does a substring search for usernames that start with 'query'
            // return (data ? (data) : []);
            setSearchResults(data || []);}, 300)

        
        // setSearchResults(fetchSearch()); // doesnt like this bc cant await
        // fetchSearch();
        return () => clearTimeout(timerSearch);
    },[query, supabase]);

//     useEffect(() => {
//     console.log(searchResults);
// }, [searchResults]);
    // Need like a timer function that prevents this from running on every change

    return(
        // <div className="fixed inset-0 max-w-5xl p-6">
        // </div>
        <>
            <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Create post"
            >
                <SearchIcon size={20} />
            </button>
            {/* If open we wanna then render searchModal */}
            {open && createPortal(
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 px-4 py-6">
                    <div
                    className="absolute inset-0"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                    />
                    {/* <div className="relative z-10 max-w-xl w-full bg-slate-950 rounded-xl"> */}
                    <div className="relative z-10 w-full max-w-xl rounded-3xl bg-slate-950 p-6 shadow-2xl ring-1 ring-white/10">
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between gap-4 pb-4">
                                <h2 className="text-lg font-semibold text-white">Search for users</h2>
                                <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white transition hover:bg-white/10"
                                >
                                    Close
                                </button>
                            </div>
                            <input type="text" className="bg-gray-400 rounded-md" onChange={(e) => setQuery(e.target.value)}/>
                            {searchResults ? console.log(searchResults) : (null)}
                        </div>
                    </div>
                    </div>
                ,document.body
            )}
        </>
    );
}

///------ OG bad below

// "use client"

// import { useMemo, useState } from "react"
// import { createPortal } from "react-dom"
// import { Search as SearchIcon } from "lucide-react"
// import { createBrowserSupabaseClient } from "@/lib/supabase/client"


// export default function Search(){
//     const supabase = useMemo(() => (createBrowserSupabaseClient()), []);
//     const [query, setQuery] = useState<string>("");
//     const [open, setOpen] = useState<boolean>(false);

//     return(
//         // <div className="fixed inset-0 max-w-5xl p-6">
//         // </div>
//         <>
//             <button
//             type="button"
//             onClick={() => setOpen(true)}
//             className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
//             aria-label="Create post"
//             >
//                 <SearchIcon size={20} />
//             </button>
//             {/* If open we wanna then render searchModal */}
//             {open && createPortal(
//                 <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 px-4 py-6">
//                     <div
//                     className="absolute inset-0"
//                     onClick={() => setOpen(false)}
//                     aria-hidden="true"
//                     >
//                     <div className="relative z-10 max-w-xl w-full bg-white rounded-xl">
//                         <div className="flex items-center justify-between gap-4 pb-4">
//                             <h2 className="text-lg font-semibold text-white">Create Post</h2>
//                             <button
//                             type="button"
//                             onClick={() => setOpen(false)}
//                             className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white transition hover:bg-white/10"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                     </div>
//                 </div>,
//                 document.body
//             )}
//         </>
//     );
// }