import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";
import "@uploadthing/react/styles.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

export const metadata: Metadata = {
  title: "Jasper Gallery",
  description: "Practice Gallery",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout(props: {
  children: React.ReactNode,
  modal: React.ReactNode,
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <body className="flex flex-col gap-4">
          <TopNav />
          {props.children}
          {props.modal}
          <div id="modal-root" />
        </body>
      </html>
    </ClerkProvider>
  );
}
