"use client" // Need use clietn to be able to submit data to db, so need useEffect and state for forms


import { useState, useEffect, useMemo  } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { userUpdate, type UserUpdate } from "@/lib/users";


// 'async' not allowed in client components
// const UserType = UserUpdate
type Profile = {
    username: string | null;
    name: string | null;
    bio: string | null;
    pfp_path: string;
};

export default function SettingsForm( { profile }: {profile: Profile} ){
    const supabase = useMemo(() => createBrowserSupabaseClient(), []);
    // const { data } = await supabase.auth.getUser();
    
    const [name, setName] = useState(profile.name);
    const [username, setUserName] = useState(""); // for right now username is immutable
    const [bio, setBio] = useState<string>("");
    const [is_private, setPrivate] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [pfp, setPfp] = useState<string>(profile.pfp_path);

    const [err, setError] = useState<boolean>(false) // no error at first
    const [message, setMessage] = useState("")

    const [file, setFile] = useState<File | null>(null); // technically the default will be the original path that exists in db as a default

    console.log(`profile_prop: ${profile.pfp_path}`);

    useEffect(() => {

        async function fetch_pfp(){
            const { data } = await supabase.auth.getUser();
            const { data: init_q, error } = await supabase.from("users").select("username,name,pfp_path").eq("id", data.user?.id).single();
            if(!error){
                setPfp(init_q.pfp_path); // get the current one
                console.log(`hallo init_q.pfp: ${init_q.pfp_path}`)

                // move here
                
                // move here
            }
            else console.log("err, no thing");
        }
        
        fetch_pfp();
        const { data: storage_obj } = supabase.storage
        .from("pfp")
        .getPublicUrl(pfp);

        const url = storage_obj.publicUrl;
        console.log(`url ${url}`);
        setPfp(url);
        console.log(`pfp_url: ${pfp}`);

    },[]);

    // const { data: init_q, error } = await supabase.from("users").select("username,name,pfp_path").eq("id", data.user?.id).single();
    // if(!error){
    //     setPfp(init_q.pfp_path);
    // }

    // const { data: storage_obj } = supabase.storage
    // .from("pfp")
    // .getPublicUrl(pfp);
    
    // const url = storage_obj.publicUrl;
    // setPfp(url);


    // Need a helper function, that takes in a form. 
    // 1. Prevents refresh on submit
    // 2. get the file and name from the form
    // 3. send the file and file name convention to supabase
    
    // The exported function cannot be async itself for client comps (good thing you can for functions inside :) )
    async function handlePfpSubmit(file: File) {

        const {data: {user}} = await supabase.auth.getUser();

        if(!file || !user) return;

        // Unique file path
        const filePath = `${user!.id}/${crypto.randomUUID()}`;

        
        const { data, error } = await supabase.storage
        .from("pfp")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
        });

        if (error) {
            console.error(error);
            return;
        }

        // console.log(data);
    }

    //We need to track the actual values to have like 
                // useEffect(()=>{
                //     async function loadProfile() {
                //         //fetch here so that on mount 1. It gets profile data
                //         const { data, error } = await supabase.from("users").select("username,name,bio").single();
                //         if (data) {
                //             setName(data.name ?? ""); // this is required so dont need a checker
                //             setUserName(data.username ?? "");
                //             setBio(data.bio ?? "");
                //         }

                //         if(error) console.log(`Error settings: ${error.message}`);
                //     }

                //     loadProfile();

                //     return(() =>{
                //         setCancelled(true);
                        
                //     })
                // },[]); // need to make it rerun, based on if the subimit happens (cant do bio, name, or pfp as then "on change" would change state and re-render)

    // const data = supabase.from().select()
    // or get helper
    
    // const avatarFile = event.target.files[0]
    // const { data, error } = await supabase
    // .storage
    // .from('avatars')
    // .upload('public/avatar1.png', avatarFile, {
    //     cacheControl: '3600',
    //     upsert: false
    // })

    return(
        <div className="mx-auto">
            {/* flex col to have different segments */}
            {/* FULL CONTAINER */}
            <div className="flex flex-col flex-0 mt-8">
                {/*  */}
                <h1>Edit profile</h1>
                {/* change_photo */}
                <div className="flex gap-8">
                    <div>profile image-tk</div>
                    {/* <img src="https://qznrktvvosorwedhyjjg.supabase.co/storage/v1/object/public/pfp/default_avatar.jpg" alt="default pfp" className="w-16 h-16 rounded-full"/> */}
                    <img src={pfp} alt="default pfp" className="w-16 h-16 rounded-full"/>
                    <div className="flex flex-col">
                        <div>{profile.name}</div>
                        <div>{profile.username}</div>
                    </div>


                    <label htmlFor="imageUpload">Select an image:</label>
                    <input 
                        type="file" 
                        id="imageUpload" 
                        name="imageUpload" 
                        accept="image/*" 
                        onChange={(e) => {
                            const selectedFile = e.target.files?.[0];
                            if (selectedFile) { // If a file was actually selected; otherwise dont change the image set state
                                // setFile(selectedFile);
                                handlePfpSubmit(selectedFile);
                            }
                    }}/>



                </div>

                {/* I feel like the image submission should be its own thing as those changes are reflected on screen, so state(img) = curr {like i was trying to do with name} */}
                <form onSubmit={async (e) => {
                    e.preventDefault(); 
                    const res = setError(await userUpdate({supabase}, {bio}));}}>
                        <div>
                            <div>Change Bio</div>
                            <textarea onChange={(e) => {setBio(e.target.value)}} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                        <div>
                           hallo 
                        </div>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Submit</button>
                </form>
            </div>

            <div>
                {!err ? 
                    (<div>Your profile has been submitted</div>)
                    : (<div> Something wrong has occured.</div>)}
            </div>





        </div>
    );
}