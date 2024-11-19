import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { SimpleUploadButton } from "./upload-button";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between p-4">
      <div className="container mx-auto flex items-center justify-between gap-5 border-b p-4 text-xl font-semibold">
        <a href="/gallery">Gallery</a>
        <div className="flex flex-row gap-4 items-center">
          <SignedOut>
            <SignInButton></SignInButton>
          </SignedOut>
          <SignedIn>
            <SimpleUploadButton />
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
