"use client";

import { useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { userUpdate } from "@/lib/users";

type Profile = {
    username: string | null;
    name: string | null;
    bio: string | null;
    pfp_url: string;
};

export default function SettingsForm({
    profile,
}: {
    profile: Profile;
}) {
    const supabase = useMemo(
        () => createBrowserSupabaseClient(),
        []
    );

    // INITIAL VALUES FROM SERVER
    const [name, setName] = useState(profile.name ?? "");
    const [username, setUserName] = useState(
        profile.username ?? ""
    );
    const [bio, setBio] = useState(profile.bio ?? "");

    // IMPORTANT:
    // This is now already a FULL PUBLIC URL
    const [pfp, setPfp] = useState(profile.pfp_url);

    const [err, setError] = useState(false);
    // const [message, setMessage] = useState(""); // used in tandem with error messages; I get it but lowkey a forehead. well, live and learn huh

    async function handlePfpSubmit(file: File) {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!file || !user) return;

        // unique file path
        const filePath = `${user.id}/${crypto.randomUUID()}`;

        // upload image
        const { error: uploadError } = await supabase.storage
            .from("pfp")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            console.error(uploadError);
            return;
        }

        // get public URL
        const { data: storageObj } = supabase.storage
            .from("pfp")
            .getPublicUrl(filePath);

        const publicUrl = storageObj.publicUrl;

        // update DB with NEW PATH
        const { error: dbError } = await supabase
            .from("users")
            .update({
                pfp_path: filePath,
            })
            .eq("id", user.id);

        if (dbError) {
            console.error(dbError);
            return;
        }

        // instantly update UI
        setPfp(publicUrl);
    }

    return (
        <div className="w-full px-4 py-6 sm:px-6">
            <div className="mx-auto w-full max-w-2xl overflow-x-hidden rounded-2xl border border-blue-500/60 p-4 sm:p-6">
                <div className="mt-2 flex flex-col gap-4 border border-green-500/60 p-2 sm:p-4">
                    <h1 className="text-xl font-semibold">Edit profile</h1>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                        <div className="flex items-center gap-3">
                            <img
                                src={pfp}
                                alt="profile picture"
                                className="h-16 w-16 rounded-full object-cover"
                            />

                            <div className="min-w-0">
                                <div className="font-medium">{name}</div>
                                <div className="truncate text-sm text-slate-600">
                                    {username}
                                </div>
                            </div>
                        </div>

                        <div className="flex min-w-0 flex-col gap-2">
                            <label className="text-sm font-medium" htmlFor="imageUpload">
                                Select an image:
                            </label>

                            <input
                                type="file"
                                id="imageUpload"
                                name="imageUpload"
                                accept="image/*"
                                className="w-full max-w-full text-sm"
                                onChange={(e) => {
                                    const selectedFile =
                                        e.target.files?.[0];

                                    if (selectedFile) {
                                        handlePfpSubmit(selectedFile);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <form
                        className="mt-2 flex flex-col gap-4"
                        onSubmit={async (e) => {
                            e.preventDefault();

                            const hasError = await userUpdate(
                                { supabase },
                                { bio }
                            );

                            setError(hasError);
                        }}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="font-medium">Change Bio</div>

                            <textarea
                                value={bio}
                                onChange={(e) => {
                                    setBio(e.target.value);
                                }}
                                className="min-h-[120px] w-full max-w-full resize-y rounded-md border border-gray-300 bg-gray-200 px-3 py-2 text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </form>
                </div>

                <div className="mt-4 text-sm">
                    {!err ? (
                        <div>Your profile has been submitted</div>
                    ) : (
                        <div>Something wrong has occurred.</div>
                    )}
                </div>
            </div>
        </div>
    );
}