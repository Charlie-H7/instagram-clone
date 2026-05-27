//lowkey could just get rid of feed and make this like the home page tsx for the /app directory no??
"use client"
import { PostRow,PostFetch } from "@/lib/posts";

export default function Feed({user_id, image_path}: PostFetch){
    // const obj = map
    return(
        <div>
            {/* Name + picture in row*/}
            <div></div>
            <div>{user_id}</div>
            <div>{image_path}</div>
            {/* // widget like comment + bookmark; as row
            // top comment section col */}
        </div>
    );
}