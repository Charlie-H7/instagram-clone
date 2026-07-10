

import PostModal from "../../components/PostModal";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(`params.id ${id}`);
  return <PostModal id={id} />;
}
