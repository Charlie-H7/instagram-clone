// PlusButton.tsx
"use client";

import { useEffect, useState, useCallback, useMemo, use } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { uploadPost } from "@/lib/posts";
import { Plus } from "lucide-react";

export default function CreatePost() {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [postImage, setPostImage] = useState<File|null>(null);
    const supabase = useMemo(() => createBrowserSupabaseClient(), []);
    const router = useRouter();
    
    
    // This is used for managing the portal mount state, hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = useCallback(async (file: File) => {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("User not authenticated");
        }
        // unique file path
        const filePath = `${user.id}/${crypto.randomUUID()}`;
        // upload image
        const { error: uploadError } = await supabase.storage
            .from("posts")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });
        console.log("Reached here 1");

        if (uploadError) {
            console.error(uploadError);
            return;
        }
        // // Get the url of the uploaded image and set it in the database
        // const { data: storageObj } = supabase.storage
        //     .from("posts")
        //     .getPublicUrl(filePath);
        
        // const publicUrl = storageObj.publicUrl;
        // Now we can create the post in the database
        const post = await uploadPost(supabase, {
            user_id: user.id,
            image_path: filePath,
        });
        console.log("Reached here 2");

        // Reroute to p/[id] from 'id' of posts table supabase
        if (post) {
            setOpen(false);
            // setMounted(false);
            router.push(`app/p/${post.id}`);
            setPostImage(null);
        }
        console.log("Reached here 3"); // Lol ideally it shouldn't get here

    },[supabase, router]);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Create post"
            >
                <Plus size={20} />
            </button>

            {open && mounted && createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
                <div
                    className="absolute inset-0"
                    onClick={() => {setOpen(false); setPostImage(null);}}
                    aria-hidden="true"
                />
                <div className="relative z-10 w-full max-w-xl rounded-3xl bg-slate-950 p-6 shadow-2xl ring-1 ring-white/10">
                    <div className="flex items-center justify-between gap-4 pb-4">
                        <h2 className="text-lg font-semibold text-white">Create Post</h2>
                        <button
                            type="button"
                            onClick={() => {setOpen(false); setPostImage(null);}}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white transition hover:bg-white/10"
                        >
                            Close
                        </button>
                    </div>
                    <div className="space-y-4 text-sm text-slate-200">
                        <p>Add your post content here, then submit.</p>
                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                            {/* <p className="text-slate-400">Post editor placeholder</p> */}
                            {/* Post submission */}
                            <form
                                className="flex flex-col gap-4"
                                onSubmit={(e) => {
                                    e.preventDefault();

                                    if (postImage) {
                                        handleSubmit(postImage);
                                    }
                                }}
                            >
                                <input
                                    id="PostUpload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const selectedFile = e.target.files?.[0];

                                        if (selectedFile) {
                                            setPostImage(selectedFile);
                                        }
                                    }}
                                />

                                <label
                                    htmlFor="PostUpload"
                                    className="w-fit cursor-pointer rounded-lg bg-zinc-800 px-4 py-2 text-white transition hover:bg-zinc-700"
                                >
                                    {postImage ? "Change Image" : "Choose Image"}
                                </label>

                                {postImage && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">
                                            {postImage.name}
                                        </p>

                                        <img
                                            src={URL.createObjectURL(postImage)}
                                            alt="Preview"
                                            className="max-h-80 rounded-lg border object-contain"
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!postImage}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Submit Post
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>,
                document.body,
            )}
        </>
    );
}