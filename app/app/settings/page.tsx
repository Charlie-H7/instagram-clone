// // "use client" // Need use clietn to be able to submit data to db, so need useEffect and state for forms

// import { useMemo  } from "react"; // No use effect in server pages
// import { createClient } from "@/lib/supabase/server";
// import { userUpdate } from "@/lib/users";
// import SettingsForm from "./components/SettingsForm"

// // 'async' not allowed in client components (well it is but a bit more complicated than that)    
    
// export default async function Page() {
//     const supabase = await useMemo(() => createClient(), []);
//     // const supabase = await createClient();

//     const { data: profile } = await supabase
//         .from("users")
//         .select("username,name,bio,pfp_path")
//         .single();

//     if (!profile) {
//         throw new Error("Profile not found");
//     }

//     // Type '{ username: any; name: any; bio: any; } | null' is not assignable to type 'Profile'.
// //   Type 'null' is not assignable to type 'Profile' (Solution above in case profile is blank)
//     return <SettingsForm profile={profile} />;
    
// }

// app/settings/page.tsx

import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./components/SettingsForm";

export default async function Page() {
    const supabase = await createClient();
    const { data, error: user_err } = await supabase.auth.getUser();
    if(user_err){
        throw new Error(user_err.message);
    }

    // get profile
    const { data: profile, error } = await supabase
        .from("users")
        .select("username, name, bio, pfp_path")
        .eq("id", data.user.id)
        .single();

    if (error || !profile) {
        console.log(profile);
        throw new Error("Profile not found");
    }

    // convert storage path -> public URL
    const { data: storageObj } = supabase.storage
        .from("pfp")
        .getPublicUrl(profile.pfp_path);

        console.log(storageObj)

    // send FINAL usable url to client
    const profileWithUrl = {
        ...profile,
        pfp_url: storageObj.publicUrl,
    };

    console.log(profileWithUrl)

    return (
        <SettingsForm profile={profileWithUrl} />
    );
}