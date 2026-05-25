"use client"

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useMemo } from "react";

export default function LogoutButton(){
    const supabase = useMemo(() => createBrowserSupabaseClient(), []);
    return (
        <button className="block px-4 py-2 text-sm text-slate-400" onClick={async () => {
            supabase.auth.signOut();
        }}>
            Logout
        </button>
    );
}
// add router push back to '/' -> with cookie gone force to re-log!