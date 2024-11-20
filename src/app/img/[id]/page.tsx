import { FullPageImageView } from "~/common/full-page-image-view";

export default function PhotoPage({
  params: { id: imageId },
}: {
  params: { id: string };
}) {
  return <FullPageImageView photoId={imageId} />;
}
