import { createClient } from "@supabase/supabase-js";
// import { followUser } from "./followUser";
import { followUser } from "./supabase/followUsers";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// Good test, however this requires a user to be signed in, (can be done; however just shows me that my following behavior is contingent on users actually being logged in)
// If you really wanna test this just add "await supabase.auth.signInWithPassword(...)" should work but for now more to think about

console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);

const TEST_USER_A = "d237eac5-43cb-4dfd-80d1-302e1f759bae";
const TEST_USER_B = "1507e876-8c52-49ce-b5d1-a8a3ce3a75c7";

test("user can follow another user", async () => {
    await supabase
        .from("following")
        .delete()
        .eq("follower_id", TEST_USER_A)
        .eq("following_id", TEST_USER_B);

    await followUser(
        supabase,
        TEST_USER_A,
        TEST_USER_B
    );

    const { data, error } = await supabase
        .from("following")
        .select("*")
        .eq("follower_id", TEST_USER_A)
        .eq("following_id", TEST_USER_B);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);

    await supabase
        .from("following")
        .delete()
        .eq("follower_id", TEST_USER_A)
        .eq("following_id", TEST_USER_B);
});