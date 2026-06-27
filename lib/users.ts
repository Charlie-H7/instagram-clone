import { SupabaseClient } from "@supabase/supabase-js"

// type UserTypes = {
//     // id?:  not sure about this one, because this is refered to by table
//     id: string;
//     name: string;
//     username: string;
//     bio: string | null;
//     is_private: boolean;
//     // created: timestampz type??
//     created: string;
    
// };

export type UserRow = {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  is_private: boolean;
  created: string; // timestamptz comes back as ISO string
};

export type UserInsert = {
    id: string;
    name: string;
    username: string;
    bio?: string | null;
    is_private?: boolean;
};

// Used for setting changes
export type UserUpdate = {
    name?: string;
    bio?: string;
    is_private?: boolean;
    pfp_path?: string;
};

type clientTypes = {
    supabase : SupabaseClient;
};

// make the server client
export async function userSignUp( {supabase} : clientTypes, {id, name, username} : UserInsert){
    const error = await supabase.from("users").insert({
        id,
        name,
        username,
    });

    if(error.error){
        console.log(error.error.message);
        console.log("error at insert");
    }
};

// Only listing the ones that they should ideally have access to modify and even then not all of them have to change at the same time. DO I HAVE TO CREATE AN UPDATE FOR EACH COLUMN SINCE NOT ALL WILL CHANGE OR CAN I DO LIKE 'username?' in param
export async function userUpdate( {supabase}: clientTypes, {name, bio, is_private, pfp_path}: UserUpdate ){
    const {error} = await supabase.from("users").update({
        name,
        bio,
        is_private,
        pfp_path,
    }).eq("id",(await supabase.auth.getUser()).data.user?.id);

    if(error) {
        console.log(error.message);
        console.log("err in updateUser");
        return true;
    };

    return(false);
};


export async function userDelete( {supabase} : clientTypes, {id}: UserRow ){
    const {error} = await supabase.from("users").delete().eq("id", id); // Where id is the passed in id
    if(error) console.log(error.message);
}

// -----
