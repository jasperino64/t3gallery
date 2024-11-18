import { Modal } from "./modal";
import FullPageImageView from "~/components/full-image-page";

export default function PhotoModal({
  params: {id: imageId},
}: {
  params: { id: string };
}) {
  const idAsNumber = Number(imageId);
  if (Number.isNaN(idAsNumber)) {
    throw new Error("Invalid ID");
  }

  return (
    <Modal>
      <FullPageImageView id={idAsNumber} />
    </Modal>
  );
}
