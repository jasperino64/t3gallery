import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "T3 Gallery",
  description: "Modern react tutorial",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};
function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between p-4">
      <div className="container mx-auto flex items-center justify-between gap-5 border-b p-4 text-xl font-semibold">
        <a href="/gallery">Gallery</a>
        <div>Sign in</div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex flex-col gap-4">
        <TopNav />
        {children}
      </body>
    </html>
  );
}
