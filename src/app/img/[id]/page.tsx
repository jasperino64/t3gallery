import { FullPageImageView } from "~/components/full-image-page";

export default function PhotoPage({
  params: { id: imageId },
}: {
  params: { id: string };
}) {
  return <FullPageImageView photoId={imageId} />;
}
