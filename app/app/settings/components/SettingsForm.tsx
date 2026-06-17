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
        <div className="max-w-md w-full mx-auto">
            <div className="flex flex-col mt-8">
                <h1>Edit profile</h1>

                <div className="flex gap-8 items-center">
                    <img
                        src={pfp}
                        alt="profile picture"
                        className="w-16 h-16 rounded-full object-cover"
                    />

                    <div className="flex flex-col">
                        <div>{name}</div>
                        <div>{username}</div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="imageUpload">
                            Select an image:
                        </label>

                        <input
                            type="file"
                            id="imageUpload"
                            name="imageUpload"
                            accept="image/*"
                            onChange={(e) => {
                                const selectedFile =
                                    e.target.files?.[0];

                                if (selectedFile) {
                                    handlePfpSubmit(
                                        selectedFile
                                    );
                                }
                            }}
                        />
                    </div>
                </div>

                <form
                    className="mt-6"
                    onSubmit={async (e) => {
                        e.preventDefault();

                        const hasError =
                            await userUpdate(
                                { supabase },
                                { bio }
                            );

                        setError(hasError);
                    }}
                >
                    <div className="flex flex-col gap-2">
                        <div>Change Bio</div>

                        <textarea
                            value={bio}
                            onChange={(e) => {
                                setBio(e.target.value);
                            }}
                            className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>

            <div className="mt-4">
                {!err ? (
                    <div>
                        Your profile has been submitted
                    </div>
                ) : (
                    <div>
                        Something wrong has occurred.
                    </div>
                )}
            </div>
        </div>
    );
}