// "use cilent";

//idea server side rendiering here
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";





export default async function Profiles({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();
    const {data: user_data} = await supabase.auth.getUser(); // is needed for rendering based on if its your profile
    
    // const {data: {user}} = await supabase.auth.getUser();
    const {data: profile} = await supabase.from("users").select("name, username, pfp_path").eq("id", id).single();
    if(!profile || !user_data){
        return;
    }

    //Get the image
    const pfpPublicUrl = supabase.storage.from("pfp").getPublicUrl(profile.pfp_path).data.publicUrl;
    // console.log(data);
    // console.log("Hallo");
    return(
        <div className="flex flex-col space-y-12 max-w-md mx-auto">
            <div className="flex flex-row flex-wrap items-start gap-8 pt-8">
                <div className="rounded-full w-20 h-20 relative overflow-hidden">
                    <Image src={pfpPublicUrl} alt={`${profile.username}: pfp`} fill/>
                </div>
                <div className="flex flex-col">
                    {/* {user?.} */}
                    <span>{profile.name}</span>
                    {/* <span>{profile.username}</span> */}
                    <span>{profile.username}</span>
                    <div className="flex flex-row">
                        <div># Posts</div>
                        <div># followers</div>
                        <div># following placeholder</div>
                    </div>
                </div>
            </div>
            { user_data.user?.id === id ?
                <div className="flex flex-row gap-2">
                    <Link href="/app/settings" className="bg-blue-500 text-white py-2 px-4 rounded-md transition hover:bg-gray-700">Edit Profile</Link>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">hallo 2</button>
                </div> : null
            }
        </div>
    );
}