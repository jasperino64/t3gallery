import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Sign } from "crypto";
import { db } from "~/server/db";
import { getMyImages } from "~/server/queries";

export const dynamic = "force-dynamic";

async function Images() {
  const images = await getMyImages();

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {images.map((image, index) => (
        <div key={image.name + index} className="flex w-40 flex-col">
          <a href={image.url}>
            <img
              className="h-80 w-auto object-cover"
              src={image.url}
              alt={image.name}
            />
          </a>
          <div>{image.name}</div>
        </div>
      ))}
    </div>
  );
}
export default async function HomePage() {
  // const posts = await db.query.posts.findMany();
  // console.log(posts);

  return (
    <main>
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please sign in to view the gallery.
        </div>
      </SignedOut>
      <SignedIn>
        <Images />
      </SignedIn>
    </main>
  );
}
