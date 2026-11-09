import { clerkClient } from "@clerk/nextjs/server";
import { Button } from "~/components/ui/button";
import { ConfirmDeleteButton } from "~/common/confirm-delete-button";
import { deleteImage, getImage, renameImage } from "~/server/queries";

export async function FullPageImageView(props: { photoId: string }) {
  const idAsNumber = Number(props.photoId);
  if (Number.isNaN(idAsNumber)) throw new Error("Invalid photo id");

  const image = await getImage(idAsNumber);

  const userInfo = await (await clerkClient()).users.getUser(image.userId);

  return (
    <div className="flex h-full w-screen min-w-0 items-center justify-center text-white">
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <img
          src={image.url}
          className="object-contain"
          alt={image.name}
        />
      </div>
      <div className="flex h-full w-56 flex-shrink-0 flex-col border-l">
        <form
          action={async (formData: FormData) => {
            "use server";

            const name = formData.get("name");
            if (typeof name !== "string") {
              throw new Error("Image name is required");
            }

            await renameImage(idAsNumber, name);
          }}
          className="flex flex-col gap-2 border-b p-2"
        >
          <label htmlFor="image-name" className="text-center text-xl">
            Image name
          </label>
          <input
            id="image-name"
            name="name"
            type="text"
            defaultValue={image.name}
            maxLength={256}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
          />
          <Button type="submit">Save name</Button>
        </form>

        <div className="p-2">
          <div>Uploaded By:</div>
          <div>{userInfo.fullName}</div>
        </div>

        <div className="p-2">
          <div>Created On:</div>
          <div>{image.createdAt.toLocaleDateString()}</div>
        </div>

        <div className="p-2">
          <ConfirmDeleteButton
            action={async (_formData: FormData) => {
              "use server";

              await deleteImage(idAsNumber);
            }}
          />
        </div>
      </div>
    </div>
  );
}
