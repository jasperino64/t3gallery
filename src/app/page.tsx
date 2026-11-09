import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { getMyImages } from "~/server/queries";

export const dynamic = "force-dynamic";

async function Images() {
  const images = await getMyImages();

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-4">
      {images.map((image, index) => (
        <div key={image.id} className="flex w-40 flex-col">
          <Link href={`/img/${image.id}`}>
            <Image
              className="h-80 w-auto object-cover"
              width={192}
              height={192}
              style={{ objectFit: "cover" }}
              src={image.url}
              alt={image.name}
            />
          </Link>
          <div className="text-center">{image.name.length <= 10 ? image.name : `${image.name.substring(0, 15)}...`}</div>
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
