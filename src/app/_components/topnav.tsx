import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between p-4">
      <div className="container mx-auto flex items-center justify-between gap-5 border-b p-4 text-xl font-semibold">
        <a href="/gallery">Gallery</a>
        <div>
          <SignedOut>
            <SignInButton></SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton></UserButton>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
