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