"use client"
// import primary so that i can color div background with it
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

// Importing db functions
import { userSignUp, userUpdate, userDelete } from "@/lib/users";

type shellPropTypes = {
    supabase: SupabaseClient;
    session: Session | null;
    authLoading: boolean
}

export default function AuthPanel( {supabase, session, authLoading} : shellPropTypes ) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams?.get("mode");
    const login = mode !== "signup";
    const createAccount = mode === "signup";

    // Data being used for the database
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUserName] = useState("");

    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null >(null);

    function setMode(nextMode: "login" | "signup") {
        const url = new URL(window.location.href);

        if (nextMode === "signup") {
            url.searchParams.set("mode", "signup");
        } else {
            url.searchParams.delete("mode");
        }

        router.replace(url.pathname + url.search);
    }

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

    async function handleSignUp(e: React.FormEvent){
        e.preventDefault();
        setBusy(true);
        setMessage(null);
        
        const {data, error} = await supabase.auth.signUp({
            email: email.trim(),
            password: password
        });
        if(error){
            setMessage(error.message);
            setBusy(false);
            return;
        }

        // update user data when an account is created
        userSignUp({supabase}, {name, username});

    }

    // Create function
if (login)
    return(
        // Assume no session at this point (check this in shell)
        // if login screen login
        // otherwise use sign-up screen

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
                <div className="text-xl font-bold text-start">Login</div>
                <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full lg:max-w-[calc(100%-2rem)] border-1 border-blue-500">
                    <label>Username or email</label>
                    <input required type="email" value={email} placeholder="Enter your username or email" onChange={(e) => setEmail(e.target.value)} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <label>Password</label>
                    <input required type="password" value={password} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Log In</button>
                    <button type="button" onClick={() => setMode("signup")}>Don't have an account? Create an account!</button>
                </form>
            </div>
        </div>
    )

    if(createAccount)
        return(
            <div className="flex flex-row border-2 border-red-500 w-full h-full min-h-[calc(100vh-4rem)]">
                <div className="hidden text-3xl font-bold lg:flex flex-1 flex-col items-center justify-center border-2 border-red-500">
                    Don't be a stranger! Make new friends and share your experiences with the world!
                </div>

                <div className="flex flex-1 flex-col items-start justify-center lg:max-w-1/2 lg:w-full border-2 border-red-500 bg-primary font-['Helvetica'] gap-6 px-6">
                    <div className="text-xl font-bold text-start">Create Account</div>
                    <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full lg:max-w-[calc(100%-2rem)] border-1 border-blue-500">
                        <label>Email</label>
                        <input required type="email" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <label>Password</label>
                        <input required type="password" value={password} placeholder="Create a password" onChange={(e) => setPassword(e.target.value)} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>

                        <label>Name</label>
                        <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <label>Username</label>
                        <input required type="text" value={username} onChange={(e) => setUserName(e.target.value)} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>

                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Sign Up</button>
                        <button type="button" onClick={() => setMode("login")}>Already have an account? Log In!</button>
                    </form>
                </div>
            </div>
        )
    // supabase.from().select()
}


// hmmm so now that I ideally have signup "working" I need to think about how I could actually send over my states to the database and when
// 1. figure out how a user is stored in auth
// 2. figure out how a user can send to the db
