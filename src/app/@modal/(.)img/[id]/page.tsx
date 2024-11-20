import { Modal } from "./modal";
import { FullPageImageView } from "~/common/full-page-image-view";

export default async function PhotoModal({
  params,
}: {
  params: { id: string };
}) {
  const { id: photoId } = await params;
  return (
    <Modal>
      <FullPageImageView photoId={photoId} />
    </Modal>
  );
}
