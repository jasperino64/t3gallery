import { TrashImageManager } from "~/common/trash-image-manager";
import {
  getMyTrashedImages,
  permanentlyDeleteTrashedImages,
  restoreImage,
  restoreTrashedImages,
} from "~/server/queries";

export const dynamic = "force-dynamic";

export default async function TrashPage() {
  const images = await getMyTrashedImages();

  async function restoreSelectedImage(formData: FormData) {
    "use server";

    const imageId = Number(formData.get("imageId"));
    await restoreImage(imageId);
  }

  async function restoreSelectedImages(formData: FormData) {
    "use server";

    const imageIds = formData.getAll("imageId").map(Number);
    await restoreTrashedImages(imageIds);
  }

  async function deleteSelectedImages(
    formData: FormData,
  ): Promise<{ error?: string }> {
    "use server";

    try {
      const imageIds = formData.getAll("imageId").map(Number);
      await permanentlyDeleteTrashedImages(imageIds);
      return {};
    } catch (error) {
      console.error("Failed to permanently delete trashed images", error);
      return {
        error:
          error instanceof Error
            ? error.message
            : "Unable to permanently delete the selected images.",
      };
    }
  }

  return (
    <main className="mx-auto min-h-full max-w-[1600px] px-5 py-10 sm:px-8 lg:px-12">
      <TrashImageManager
        images={images.map(({ id, name, url }) => ({ id, name, url }))}
        restoreAction={restoreSelectedImage}
        restoreSelectedAction={restoreSelectedImages}
        deleteAction={deleteSelectedImages}
      />
    </main>
  );
}
