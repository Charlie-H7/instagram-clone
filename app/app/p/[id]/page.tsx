export default function PostPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">FULL PAGE POST</h1>

      <p className="mt-2">Post ID: {params.id}</p>

      <p className="mt-4 text-gray-500">
        This is the fallback page (no modal overlay)
      </p>
    </div>
  );
}