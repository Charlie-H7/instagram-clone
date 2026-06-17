import { createClient } from "@supabase/supabase-js";
// import { followUser } from "./followUser";
import { followUser } from "../followUsers";
import { unfollowUser } from "../unfollowUser";

const TEST_USER_A = "d237eac5-43cb-4dfd-80d1-302e1f759bae";
const TEST_USER_B = "1507e876-8c52-49ce-b5d1-a8a3ce3a75c7";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

describe("follow system", () => {
    beforeAll(async () => {
        await supabase.auth.signInWithPassword({
            email: "charhern1676@gmail.com",
            password: "test12"
        });
    });

    test("user can follow", async () => {
        await followUser(
            supabase,
            TEST_USER_A,
            TEST_USER_B
    );

    const { data } = await supabase
        .from("following")
        .select("*")
        .eq("follower_id", TEST_USER_A)
        .eq("following_id", TEST_USER_B);

    expect(data).toHaveLength(1);
  });

test("user can unfollow", async () => {
    await unfollowUser(supabase, TEST_USER_A, TEST_USER_B);

    const { data } = await supabase
        .from("following")
        .select("*")
        .eq("follower_id", TEST_USER_A)
        .eq("following_id", TEST_USER_B);

    expect(data).toHaveLength(0);
  });
});

// // Good test, however this requires a user to be signed in, (can be done; however just shows me that my following behavior is contingent on users actually being logged in)
// // If you really wanna test this just add "await supabase.auth.signInWithPassword(...)" should work but for now more to think about
// beforeAll(async () => {
//     await supabase.auth.signInWithPassword({
//         email: "charhern1676@gmail.com",
//         password: "test12"
//     });
// });
// console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);

// const TEST_USER_A = "d237eac5-43cb-4dfd-80d1-302e1f759bae";
// const TEST_USER_B = "1507e876-8c52-49ce-b5d1-a8a3ce3a75c7";


// test("user can follow another user", async () => {
//     await supabase
//         .from("following")
//         .delete()
//         .eq("follower_id", TEST_USER_A)
//         .eq("following_id", TEST_USER_B);
//     console.log("test");
//     await followUser(
//         supabase,
//         TEST_USER_A,
//         TEST_USER_B
//     );
//     console.log("test2");

//     const { data, error } = await supabase
//         .from("following")
//         .select("*")
//         .eq("follower_id", TEST_USER_A)
//         .eq("following_id", TEST_USER_B);

//     expect(error).toBeNull();
//     expect(data).toHaveLength(1);

//     await supabase
//         .from("following")
//         .delete()
//         .eq("follower_id", TEST_USER_A)
//         .eq("following_id", TEST_USER_B);
// });


// // // Yeah lets sign in
// // const auth = await supabase.auth.signInWithPassword({
// //     email: "test@example.com",
// //     password: "password"
// // });

// // const user = auth.data.user?.aud


// // import { createClient } from "@supabase/supabase-js";
// // import { followUser } from "./supabase/followUsers";

// // const supabase = createClient(
// //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //   process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
// // );

// // const TEST_USER_A = "d237eac5-43cb-4dfd-80d1-302e1f759bae";
// // const TEST_USER_B = "1507e876-8c52-49ce-b5d1-a8a3ce3a75c7";

// // beforeAll(async () => {
// //   await supabase.auth.signInWithPassword({
// //     email: "charhern1676@gmail.com",
// //     password: "test12"
// //   });
// // });

// // test("user can follow another user", async () => {
// //   await followUser(supabase, TEST_USER_A, TEST_USER_B);

// //   const { data } = await supabase
// //     .from("following")
// //     .select("*")
// //     .eq("follower_id", TEST_USER_A)
// //     .eq("following_id", TEST_USER_B);

// //   expect(data).toHaveLength(1);
// // });