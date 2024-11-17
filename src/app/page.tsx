import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // const posts = await db.query.posts.findMany();
  // console.log(posts);
  const images = await db.query.images.findMany({
    orderBy: (image, { desc }) => desc(image.id),
  });

  return (
    <main>
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
    </main>
  );
}
