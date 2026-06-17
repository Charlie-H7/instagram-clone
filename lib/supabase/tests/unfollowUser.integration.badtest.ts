// import { unfollowUser } from "./supabase/unfollowUser";
// import { followUser } from "./supabase/followUsers";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
// );

// const TEST_USER_A = "d237eac5-43cb-4dfd-80d1-302e1f759bae";
// const TEST_USER_B = "1507e876-8c52-49ce-b5d1-a8a3ce3a75c7";

// beforeAll(async () => {
//     await supabase.auth.signInWithPassword({
//         email: "charhern1676@gmail.com",
//         password: "test12"
//     });
// });

// test("user can unfollow", async () => {
//   const { data } = await supabase.auth.getUser();
//   const userId = data.user!.id;

//   await followUser(supabase, userId, TEST_USER_B);

//   await unfollowUser(supabase, userId, TEST_USER_B);

//   const { data: rows } = await supabase
//     .from("following")
//     .select("*")
//     .eq("follower_id", userId)
//     .eq("following_id", TEST_USER_B);

//   expect(rows).toHaveLength(0);
// });

// // test("test User Unfollow", async () => {
// //         // Create an insert into the db if one does not already exist
// //     await supabase.from("following").upsert({
// //         follower_id: TEST_USER_A,
// //         following_id: TEST_USER_B
// //     });

// //     // Verify that it does exist
// //     const { data, error } = await supabase.from("following").select("*").eq("follower_id", TEST_USER_A).eq("following_id", TEST_USER_B);

// //     expect(data).toHaveLength(1);

// //     // Delete the follow
// //     await unfollowUser(supabase, TEST_USER_A, TEST_USER_B);
// //     // await supabase.from("following").delete().eq("follower_id", TEST_USER_A).eq("following_id", TEST_USER_B);
// //     const {data: deletedData, error: deletedError} = await supabase.from("following").select("*").eq("follower_id", TEST_USER_A).eq("following_id", TEST_USER_B);
// //     expect(deletedData).toHaveLength(0);
// // })