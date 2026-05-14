"use client"
// import primary so that i can color div background with it
import { useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

type shellPropTypes = {
    supabase: SupabaseClient;
    session: Session | null;
    authLoading: boolean
}

export default function AuthPanel( {supabase, session, authLoading} : shellPropTypes ) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null >(null);
    const [login,setLogin] = useState<boolean>(true); // by default at the login screen
    const [createAccount, setCreateAccount] = useState<boolean>(false); // if signup is selected render sign up screen

    async function handleLogin(e: React.FormEvent){
        e.preventDefault(); // Needed to prevent the web page from loading
        
        setMessage(null);
        setBusy(true);

        // Send login data to get session
        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password
        });
        if(error) setMessage(error.message);
        else setPassword("");
    }

    async function handleLogout(){
        const error = await supabase.auth.signOut();
        setBusy(true);
    }

    async function handleSignUp(){
        const {error} = await supabase.auth.signUp({
            email: email.trim(),
            password: password
        });
        if(error) setMessage(error.message);
        else setPassword("")
    }

    // Create function

    return(
        <div className="flex flex-row border-2 border-red-500 w-full h-full min-h-[calc(100vh-4rem)]">


            {/* Image LHS tk
            {/* if screen size lg then put img otherwise put nothing /}
            {typeof window !== "undefined" && window.innerWidth >= 1024 && (
                <div className="flex flex-1 flex-col items-center justify-center lg:max-w-1/2 lg:w-full border-2 border-red-500">
                    {/* <img src="/path/to/image.jpg" alt="Auth" className="w-full h-full object-cover" /> /}
                    hallo
                </div>
            )} */}

            {/* I dont want the lhs to appear if the screen is too small so let tailwind handle it if that is the case */}
            <div className="hidden text-3xl font-bold lg:flex flex-1 flex-col items-center justify-center border-2 border-red-500">
                Don't be a stranger! Make new friends and share your experiences with the world!
            </div>

            {/* <div className="flex flex-1 flex-col items-start justify-center lg:max-w-1/2 lg:w-full border-2 border-green-500 bg-primary font-['Helvetica'] gap-6">
                <div className="text-2xl font-bold text-start mx-auto">Login</div>
                <form action="" className="flex flex-col gap-4 w-full lg:max-w-[calc(100%-2rem)] mx-auto border-1 border-blue-500"> */}

            {/* Just added left padding instead of trying to fight with margins */}
            <div className="flex flex-1 flex-col items-start justify-center lg:max-w-1/2 lg:w-full border-2 border-red-500 bg-primary font-['Helvetica'] gap-6 px-6">
                <div className="text-xl font-bold text-start" onSubmit={handleLogin}>Login</div>
                <form action="" className="flex flex-col gap-4 w-full lg:max-w-[calc(100%-2rem)] border-1 border-blue-500">
                    <label id="">Username or email</label>
                    <input required type="text" name="" id="" placeholder="Enter your username or email" className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <label id="">Password</label>
                    <input type="password" name="" id="" placeholder="Enter your password" className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </form>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={() => console.log("ahllo")}>Log In</button>
            </div>
        </div>
    )
}