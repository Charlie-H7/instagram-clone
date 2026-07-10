// "use cilent";

//idea server side rendiering here
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "../components/FollowButton";
import ProfilePosts from "../components/ProfilePosts";





export default async function Profiles({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();
    const {data: user_data} = await supabase.auth.getUser(); // is needed for rendering based on if its your profile
    

    if (!user_data?.user) {
    return;
    }
    
    // const {data: {user}} = await supabase.auth.getUser();
    const {data: profile} = await supabase.from("user_profiles").select("*").eq("id", id).single(); // replace with migration of view on users+following -> add col is following as bool 
    if(!profile ){
        return;
    }
    //Get the image
    const pfpPublicUrl = supabase.storage.from("pfp").getPublicUrl(profile.pfp_path).data.publicUrl;
    // console.log(data);
    // console.log("Hallo");
    return(
        <div className="w-full pt-8">
            <div className="mx-auto flex-col space-y-8 w-full max-w-md pl-4 md:pl-0">
                <div className="flex flex-wrap gap-2 md:gap-4">
                    <div className="rounded-full w-20 h-20 relative overflow-hidden">
                        <Image src={pfpPublicUrl} alt={`${profile.username}: pfp`} fill/>
                    </div>
                    <div className="flex flex-col">
                            <span className="font-semibold">{profile.name}</span>
                            <span className="text-primary-border">{profile.username}</span>
                        <div className="flex flex-row gap-8">
                            {/* <div># Posts</div> */}
                            <div className="flex-col">
                                <div>1000</div>
                                <div>Posts</div>
                            </div>
                            <div className="flex-col">
                                <div>1000</div>
                                <div>Followers</div>
                            </div>
                            <div className="flex-col">
                                <div>1000</div>
                                <div>Followers</div>
                            </div>
                        </div>
                    </div>
                </div>
                { user_data.user.id === id ?
                    <div className="flex gap-2 w-full">
                        <Link href="/app/settings" className="w-1/3 text-center bg-blue-500 text-white py-2 px-4 rounded-md transition hover:bg-gray-700">Edit Profile</Link>
                    </div> : <FollowButton is_following={profile.is_following} follower_id={user_data.user.id} following_id={profile.id}/> 
                }
            </div>
            {/* ------ */}
            {/* <div className="flex flex-col space-y-12 max-w-md mx-auto">
                <div className="flex flex-row flex-wrap items-start gap-8 pt-8">
                    <div className="rounded-full w-20 h-20 relative overflow-hidden">
                        <Image src={pfpPublicUrl} alt={`${profile.username}: pfp`} fill/>
                    </div>
                    <div className="flex flex-col">
                        <span>{profile.name}</span>
                        <span>{profile.username}</span>
                        <div className="flex flex-row">
                            <div># Posts</div>
                            <div># followers</div>
                            <div># following placeholder</div>
                        </div>
                    </div>
                </div>
                { user_data.user.id === id ?
                    <div className="flex flex-row gap-2">
                        <Link href="/app/settings" className="bg-blue-500 text-white py-2 px-4 rounded-md transition hover:bg-gray-700">Edit Profile</Link>
                        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">hallo 2</button>
                    </div> : <FollowButton is_following={profile.is_following} follower_id={user_data.user.id} following_id={profile.id}/> 
                }
            </div> */}
            {/* ------ */}
                <div>
                    <ProfilePosts user_id={id} />
                </div>
        </div>
    );
}