"use client"

import { useMemo, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Search as SearchIcon } from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation";
import { searchUsers } from "@/lib/searchUsers";

type SearchResults = {
    id: string;
    username: string;
    avatar_url: string;
    name: string;
};

export default function Search(){
    const supabase = useMemo(() => (createBrowserSupabaseClient()), []);
    const router = useRouter();
    const [query, setQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchResults[]>([]); // For now; get a type later after I know what data im fetching
    const [open, setOpen] = useState<boolean>(false);
    
    useEffect (() => {
        const timerSearch = setTimeout(async () => { // Make a fetch here on supabase based on 'query that is updated'
            // does a substring search for usernames that start with 'query'
            const data = await searchUsers(supabase, query);
            // return (data ? (data) : []);
            setSearchResults(data || []);}, 300)
            return () => clearTimeout(timerSearch);
    },[query, supabase]);
    
        useEffect(() => {
        console.log(searchResults);
    }, [searchResults]);

    return(
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
                            <input type="text" className="bg-gray-400 rounded-md mb-2" onChange={(e) => setQuery(e.target.value)}/>
                            {searchResults.map((user) => (
                                <div key={user.id} className="flex gap-2 rounded-md border border-primary-border hover:bg-gray-200/20" onClick={() => {setOpen(false); router.push(`/app/u/${user.id}`)}}>
                                    <div>img_here</div>
                                    <div className="flex flex-col ">
                                        <div>{user.username}</div>
                                        <div>{user.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>
                ,document.body
            )}
        </>
    );
}
