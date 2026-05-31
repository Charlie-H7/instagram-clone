"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import Image from "next/image";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Post from "./Post";

export default function PostModal({ id }: { id: string }) {
  const router = useRouter();
  // const supabase = useMemo(() => {createBrowserSupabaseClient();},[]);
  // const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
      {/* <div className="bg-white w-[500px] p-6 rounded-lg">
        <h1 className="text-xl font-bold">MODAL POST</h1>

        <p className="mt-2">Post ID: {id}</p> */}

        {/* <Post supabase={supabase} post_id={id}/> */}
        <Post post_id={id}/>
        <button onClick={() => router.back()}>
          Close
        </button>
      </div>
    // </div>
  );
}