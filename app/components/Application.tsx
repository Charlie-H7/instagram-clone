"use client";

import Sidebar from "./Sidebar";
import Posts from "./Posts";
// Actually I think in this case it would make more sense to work with routes on a profile/post basis
import { useEffect, useState } from "react"; // use to track data from 
import { useRouter, useSearchParams } from "next/navigation"
// So this is going to like contain like the actual feed <whole page>/ use as like the second shell
export default function Application(){
    // New
    // const mode = useSearchParams?.get();

    return (
        // sidebar
        // Feed
        // recc tk
        <div className="flex">
            <Sidebar />
            <Posts />
        </div>

        
    )
}