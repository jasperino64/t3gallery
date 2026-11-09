import { clerkClient } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  CalendarDays,
  Image as ImageIcon,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ConfirmDeleteButton } from "~/common/confirm-delete-button";
import { deleteImage, getImage, renameImage } from "~/server/queries";

export async function FullPageImageView(props: { photoId: string }) {
  const idAsNumber = Number(props.photoId);
  if (Number.isNaN(idAsNumber)) throw new Error("Invalid photo id");

  const image = await getImage(idAsNumber);

  const userInfo = await (await clerkClient()).users.getUser(image.userId);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] min-w-0 flex-col bg-[#101014] text-white lg:flex-row">
      <section className="flex min-h-[55vh] min-w-0 flex-1 flex-col p-4 sm:p-6 lg:min-h-0">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white/75 transition hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Back to gallery</span>
            <span className="sm:hidden">Gallery</span>
          </Link>
          <p className="max-w-[50%] truncate text-sm font-medium text-white/60">
            {image.name}
          </p>
        </div>
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08080a] p-3 sm:p-6">
          <Image
            src={image.url}
            fill
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-contain"
            alt={image.name}
          />
        </div>
      </section>

      <aside className="flex w-full flex-col border-t border-white/[0.08] bg-[#17161c] lg:w-80 lg:flex-shrink-0 lg:border-l lg:border-t-0">
        <form
          action={async (formData: FormData) => {
            "use server";

            const name = formData.get("name");
            if (typeof name !== "string") {
              throw new Error("Image name is required");
            }

            await renameImage(idAsNumber, name);
          }}
          className="flex flex-col gap-3 border-b border-white/[0.08] p-5 sm:p-6"
        >
          <div className="mb-1 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
              <ImageIcon aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h1 className="font-semibold tracking-tight">Photo details</h1>
              <p className="text-xs text-white/45">Manage this image</p>
            </div>
          </div>
          <label
            htmlFor="image-name"
            className="text-sm font-medium text-white/70"
          >
            Image name
          </label>
          <input
            id="image-name"
            name="name"
            type="text"
            defaultValue={image.name}
            maxLength={256}
            required
            className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/20"
          />
          <Button
            type="submit"
            className="h-11 rounded-xl bg-violet-500 text-white hover:bg-violet-400"
          >
            Save changes
          </Button>
        </form>

        <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-1 lg:p-6">
          <div className="flex items-start gap-3">
            <UserRound
              aria-hidden="true"
              className="mt-0.5 size-4 text-white/40"
            />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                Uploaded by
              </p>
              <p className="mt-1 text-sm text-white/80">
                {userInfo.fullName ?? "You"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarDays
              aria-hidden="true"
              className="mt-0.5 size-4 text-white/40"
            />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                Added on
              </p>
              <p className="mt-1 text-sm text-white/80">
                {image.createdAt.toLocaleDateString("en", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-white/[0.08] p-5 sm:p-6">
          <p className="mb-3 text-xs text-white/40">
            Deleting moves this photo to Trash, where it can be restored.
          </p>
          <ConfirmDeleteButton
            action={async (_formData: FormData) => {
              "use server";

              await deleteImage(idAsNumber);
            }}
          />
        </div>
      </aside>
    </div>
  );
}
