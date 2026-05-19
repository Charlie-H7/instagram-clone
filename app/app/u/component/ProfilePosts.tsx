"use client"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

export default async function ProfilePosts(){

    const supabase = createBrowserSupabaseClient();
    
    // Get profile post from supabase and edit them
    return(
        <div>posts here</div>
    );
    
}