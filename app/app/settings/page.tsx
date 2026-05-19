// "use client" // Need use clietn to be able to submit data to db, so need useEffect and state for forms

import { useMemo  } from "react"; // No use effect in server pages
import { createClient } from "@/lib/supabase/server";
import { userUpdate } from "@/lib/users";
import SettingsForm from "../settings/SettingsForm"

// 'async' not allowed in client components (well it is but a bit more complicated than that)    
    
export default async function Page() {
    const supabase = await useMemo(() => createClient(), []);
    // const supabase = await createClient();

    const { data: profile } = await supabase
        .from("users")
        .select("username,name,bio")
        .single();

    if (!profile) {
        throw new Error("Profile not found");
    }

    // Type '{ username: any; name: any; bio: any; } | null' is not assignable to type 'Profile'.
//   Type 'null' is not assignable to type 'Profile' (Solution above in case profile is blank)
    return <SettingsForm profile={profile} />;
    
}