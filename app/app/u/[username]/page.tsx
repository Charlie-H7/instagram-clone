// "use cilent";

//idea server side rendiering here
import { createClient } from "@/lib/supabase/server";

export default async function Profiles(){
    const supabase = await createClient();
    // const {data: {user}} = await supabase.auth.getUser();
    const {data: profile} = await supabase.from("users").select("name,username").single();
    // console.log(data);
    // console.log("Hallo");
    return(
        <div className="flex flex-col space-y-12">
            <div className="flex flex-row flex-wrap items-start gap-8 pt-8">
                <div className="">pfp</div>
                <div className="flex flex-col">
                    {/* {user?.} */}
                    <span>{profile!.name}</span>
                    <span>{profile!.username}</span>
                    <div className="flex flex-row">
                        <div># Posts</div>
                        <div># followers</div>
                        <div># following placeholder</div>
                    </div>
                </div>
            </div>

                <div className="flex flex-row gap-2">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">hallo</button>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">hallo 2</button>
                </div>
        </div>
    );
}