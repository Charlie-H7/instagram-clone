"use client";
import Sidebar from "./Sidebar";
import Posts from "./Posts";

// So this is going to like contain like the actual feed <whole page>/ use as like the second shell
export default function Application(){
    

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