import { searchUsers } from "./searchUsers";
import { SupabaseClient } from "@supabase/supabase-js";

const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      ilike: jest.fn(() => ({
        limit: jest.fn(() =>
          Promise.resolve({
            data: [
              {"idx":0,"id":"7db58468-2bdd-4194-9aa4-1acf96b687c3","name":"hecharli","username":"hecharli","bio":null,"is_private":false,"created":"2026-06-04 19:34:02.091739+00","pfp_path":"default_avatar.jpg"},
              {"idx":1,"id":"836509ab-8e41-479f-b1f5-7889ca042a83","name":"Charlie Hernandez","username":"smarse","bio":"lets try updating","is_private":false,"created":"2026-05-16 07:40:32.092889+00","pfp_path":"836509ab-8e41-479f-b1f5-7889ca042a83/cde8bd5c-dd8c-4b5e-8d1f-1b2423e68705"},
              {"idx":2,"id":"d585ce85-a90b-4ad9-a48e-e59215440c23","name":"Charlie Sheen","username":"not_smare","bio":"","is_private":false,"created":"2026-05-25 05:29:16.523342+00","pfp_path":"d585ce85-a90b-4ad9-a48e-e59215440c23/13b9663a-7cd2-4a6c-94be-2b9317527230"}
            ]
          })
        )
      }))
    }))
  }))
};

test("returns matching users", async () => { // Mock the Supabase client and its methods (but this is a bad thing to test against, better to test against the actual database but this is a start)
  const result = await searchUsers(mockSupabase as unknown as SupabaseClient, "char");

  expect(result).toHaveLength(3);
  expect(result[0].username).toBe("hecharli");
});