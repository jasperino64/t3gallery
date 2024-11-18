import FullPageImageView from "~/components/full-image-page";

export default function PhotoPage({
  params: {id: imageId},
}: {
  params: { id: string };
}) {
  const idAsNumber = Number(imageId);
  if (Number.isNaN(idAsNumber)) {
    throw new Error("Invalid ID");
  }

  return <FullPageImageView id={idAsNumber} />;
}
