export default function PostModal({ params }: { params: { id: string } }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] text-center">
        <h1 className="text-xl font-bold">Modal Works 🎉</h1>

        <p className="mt-2">Post ID: {params.id}</p>

      </div>
    </div>
  );
}