"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UploadButton } from "~/utils/uploadthing";

export function TopNav() {
  const router = useRouter();
  return (
    <nav className="flex w-full items-center justify-between p-4">
      <div className="container mx-auto flex items-center justify-between gap-5 border-b p-4 text-xl font-semibold">
        <a href="/gallery">Gallery</a>
        <div>
          <SignedOut>
            <SignInButton></SignInButton>
          </SignedOut>
          <SignedIn>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
                router.refresh();
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
