import { getMyImage } from "~/server/queries";
import { Modal } from "./modal";

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const image = await getMyImage(parseInt(id));
  return (
    <div>
      <img src={image.url} className="w-96"/>
    </div>
  );
}
