"use client"
import { useState } from "react"
import { SupabaseClient } from "@supabase/supabase-js"


export default function(supabase: SupabaseClient, like_count: number, initial_liked: boolean){
    const [likeCount, setLikeCount] = useState<number>(like_count);
    const [isLiked, setIsLiked] = useState<boolean>(initial_liked);

    return
}