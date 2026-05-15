import { createClient } from "@/lib/supabase/server"
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
  name: string;
  username: string;
  bio?: string;
  is_private?: boolean;
};

export type UserUpdate = {
  name?: string;
  bio?: string;
  is_private?: boolean;
};

type clientTypes = {
    supabase : SupabaseClient;
};

// make the server client
export async function userSignUp( {supabase} : clientTypes, {name, username} : UserInsert){
    const error = await supabase.from("users").insert({
        name,
        username,
    });

    if(error.error){
        console.log(error.error.message);
    }
};

// Only listing the ones that they should ideally have access to modify and even then not all of them have to change at the same time. DO I HAVE TO CREATE AN UPDATE FOR EACH COLUMN SINCE NOT ALL WILL CHANGE OR CAN I DO LIKE 'username?' in param
export async function userUpdate( {supabase}: clientTypes, {name, bio, is_private}: UserUpdate ){
    const {error} = await supabase.from("users").update({
        name,
        bio,
        is_private,
    });

    if(error) console.log(error.message);
};

export async function userDelete( {supabase} : clientTypes, {id}: UserRow ){
    const {error} = await supabase.from("users").delete().eq("id", id); // Where id is the passed in id
    if(error) console.log(error.message);
}