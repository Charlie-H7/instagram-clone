// export default function PostPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   return (
//     <div className="p-10">
//       <h1 className="text-2xl font-bold">FULL PAGE POST</h1>

//       <p className="mt-2">Post ID: {params.id}</p>

//       <p className="mt-4 text-gray-500">
//         This is the fallback page (no modal overlay)
//       </p>
//     </div>
//   );
// }

// import PostModal from "../../@modal/components/PostModal";
import Post from "../../@modal/components/Post";
import { createClient } from "@/lib/supabase/server";
// The main idea is that as this is the default page for the modal on refresh
// copy infinite scroll and everything but for one page as opposed to modal
export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  return (
    <div>
        <Post supabase={supabase} post_id={id}/>
        {/* <Post post_id={id}/> */}
    </div>
    // <div className="p-10">
    //   <h1 className="text-2xl font-bold">FULL PAGE POST</h1>

    //   <p className="mt-2">Post ID: {id}</p>

    //   <p className="mt-4 text-gray-500">
    //     This is the fallback page (no modal overlay)
    //   </p>
    // </div>
  );
}