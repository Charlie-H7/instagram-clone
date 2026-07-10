import Post from "../../@modal/components/Post";

// The main idea is that as this is the default page for the modal on refresh
export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // const supabase = await createClient();
  return (
    <div className="min-h-screen flex justify-center p-6">
      <div className="w-full max-w-5xl">
        <Post post_id={id} />
      </div>
    </div>
  );
}