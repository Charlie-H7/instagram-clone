import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import FollowButton from "@/app/app/u/components/FollowButton";
import FollowButton from "@/app/app/u/components/FollowButton";

                // const mockInsert = jest.fn();
                // const mockDelete = jest.fn();

                // // const mockSupabase = {
                // //   from: jest.fn(() => ({
                // //     insert: mockInsert,
                // //     delete: mockDelete,
                // //   })),
                // // };

                // const mockSupabase = {
                //   from: jest.fn(() => ({
                //     insert: jest.fn(() => Promise.resolve({ error: null })),
                //     delete: jest.fn(() => ({
                //       eq: jest.fn(() => ({
                //         eq: jest.fn(() => Promise.resolve({ error: null }))
                //       }))
                //     }))
                //   }))
                // };

// test("clicking follow calls supabase insert and toggles UI", async () => {
//   const user = userEvent.setup();

//   render(
//     <FollowButton
//       supabase={mockSupabase}
//       is_following={false}
//       follower_id="1"
//       following_id="2"
//     />
//   );

//   const button = screen.getByText("Follow");

//   await user.click(button);

//   expect(screen.getByText("Unfollow")).toBeInTheDocument();
//   expect(mockSupabase.from).toHaveBeenCalledWith("following");
// });

                    // test("user can follow someone", async () => {
                    // const user = userEvent.setup();

                    // render(
                    //     <FollowButton
                    //     is_following={false}
                    //     follower_id="1"
                    //     following_id="2"
                    //     />
                    // );

                    //     const button = screen.getByRole("button", {
                    //     name: /follow/i
                    // });

                    //     const button = screen.getByRole("button", {
                    //     name: /follow/i
                    // });

                    //     await user.click(button);

                    //     expect(
                    //     screen.getByRole("button", { name: /unfollow/i })
                    // ).toBeInTheDocument();
                    // });

    const mockSupabase = {
  from: jest.fn(() => ({
    insert: jest.fn().mockResolvedValue({ error: null }),
    delete: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null })
      }))
    }))
  }))
};

test("user can follow someone", async () => {
  const user = userEvent.setup();

  render(
    <FollowButton
      is_following={false}
      follower_id="1"
      following_id="2"
    />
  );

  const button = screen.getByRole("button", { name: /follow/i });

  await user.click(button);

  expect(
    screen.getByRole("button", { name: /unfollow/i }) // the i means case-insensitive
  ).toBeInTheDocument();
});