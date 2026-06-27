"use client";

import { useRouter } from "next/navigation";
// import Image from "next/image";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Post from "./Post";

export default function PostModal({ id }: { id: string }) {
  const router = useRouter();
  // const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
        <Post post_id={id}/>
        <button onClick={() => router.back()}>
          Close
        </button>
      </div>
    // </div>
  );
}