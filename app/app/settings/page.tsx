"use client" // Need use clietn to be able to submit data to db, so need useEffect and state for forms

import { useState, useEffect, useMemo  } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { userUpdate } from "@/lib/users";

// 'async' not allowed in client components
export default function Settings(){
    const supabase = useMemo(() => createBrowserSupabaseClient(), []);
    
    const [name, setName] = useState("");
    const [username, setUserName] = useState(""); // for right now username is immutable
    const [bio, setBio] = useState<string>("");
    const [cancelled, setCancelled] = useState(false);
    const [pfp, setPfp] = useState<string>("");


    //We need to track the actual values to have like 
    useEffect(()=>{
        async function loadProfile() {
            //fetch here so that on mount 1. It gets profile data
            const { data, error } = await supabase.from("users").select("username,name,bio").single();
            if (data) {
                setName(data.name ?? ""); // this is required so dont need a checker
                setUserName(data.username ?? "");
                setBio(data.bio ?? "");
            }

            if(error) console.log(`Error settings: ${error.message}`);
        }

        loadProfile();

        return(() =>{
            setCancelled(true);
            
        })
    },[]); // need to make it rerun, based on if the subimit happens (cant do bio, name, or pfp as then "on change" would change state and re-render)

    // const data = supabase.from().select()
    // or get helper

    return(
        <div className="mx-auto">
            {/* flex col to have different segments */}
            {/* FULL CONTAINER */}
            <div className="flex flex-col flex-0 mt-8">
                {/*  */}
                <h1>Edit profile</h1>
                {/* change_photo */}
                <div className="flex">
                    <div>profile image-tk</div>
                    <div className="flex flex-col">
                        <div>{name}</div>
                        <div>{username}</div>
                    </div>
                    <div>Button</div>
                </div>
            </div>
        </div>
    );
}