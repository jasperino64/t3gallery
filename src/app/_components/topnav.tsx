import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Images, LogIn, Trash2 } from "lucide-react";
import Link from "next/link";
import { getMyImageCount, getMyTrashCount } from "~/server/queries";
import { SimpleUploadButton } from "./upload-button";

export async function TopNav() {
  const [imageCount, trashCount] = await Promise.all([
    getMyImageCount(),
    getMyTrashCount(),
  ]);

  return (
    <nav className="relative z-10 flex min-h-16 w-full items-center justify-between border-b border-white/[0.08] bg-background/90 px-5 py-3 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300 transition group-hover:bg-violet-500/25">
            <Images aria-hidden="true" className="size-5" />
          </span>
          <span className="text-base font-semibold tracking-tight">T3 Gallery</span>
        </Link>
        <SignedIn>
          <span className="hidden rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
            {imageCount} {imageCount === 1 ? "photo" : "photos"}
          </span>
        </SignedIn>
      </div>

      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#17151d] transition hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
            >
              <LogIn aria-hidden="true" className="size-4" />
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link
            href="/trash"
            aria-label={`Trash, ${trashCount} ${trashCount === 1 ? "image" : "images"}`}
            className="relative inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-white/[0.06] hover:text-foreground"
          >
            <Trash2 aria-hidden="true" className="size-5" />
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1 text-[10px] font-semibold leading-none text-white">
              {trashCount}
            </span>
          </Link>
          <div className="flex size-10 items-center justify-center rounded-xl transition hover:bg-white/[0.06]">
            <SimpleUploadButton />
          </div>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
