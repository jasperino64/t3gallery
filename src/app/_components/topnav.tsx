import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { getMyImageCount, getMyTrashCount } from "~/server/queries";
import { SimpleUploadButton } from "./upload-button";

export async function TopNav() {
  const [imageCount, trashCount] = await Promise.all([
    getMyImageCount(),
    getMyTrashCount(),
  ]);

  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span>Gallery</span>
        </Link>
        <span className="rounded-md bg-muted px-2 py-1 text-base font-semibold text-foreground">
          {imageCount} images
        </span>
      </div>

      <div className="flex flex-row items-center gap-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <Link
            href="/trash"
            aria-label={`Trash, ${trashCount} ${trashCount === 1 ? "image" : "images"}`}
            className="relative inline-flex size-10 items-center justify-center rounded-md hover:bg-accent"
          >
            <Trash2 aria-hidden="true" className="size-5" />
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs leading-none text-primary-foreground">
              {trashCount}
            </span>
          </Link>
          <SimpleUploadButton />
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
