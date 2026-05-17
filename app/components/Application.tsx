"use client";
import Sidebar from "./Sidebar";
import Posts from "./Posts";
// Actually I think in this case it would make more sense to work with routes on a profile/post basis

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