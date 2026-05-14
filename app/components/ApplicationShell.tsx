"use client"

import { use, useEffect, useState, useMemo } from "react";

import AuthPanel from "../components/AuthPanel";
import { create } from "domain";


import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import{ Session } from "@supabase/supabase-js";
// const [supabaseClient, setSupabaseClient] = useState<any>(null); Something is wrong with this, syntax

// Need to make new projects

export default function ApplicationShell() {
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
            setSession(session);
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

    },[])
    
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <AuthPanel supabase={supabase} session={session} authLoading={authLoading} />
        </div>
    )
}