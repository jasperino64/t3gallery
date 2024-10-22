import Link from "next/link";
import { db } from "~/server/db";

const mockImages = [
  {
    name: "978fddc97cdd68c302677015fe899b34.jpg",
    key: "6xzVNiUiaeSr5R1y2ePLM39m0gQUaYbBlAyjZF5oxqSX46DE",
    customId: null,
    url: "https://utfs.io/f/6xzVNiUiaeSr5R1y2ePLM39m0gQUaYbBlAyjZF5oxqSX46DE",
    size: 99280,
    uploadedAt: "2024-10-22T20:26:29.000Z",
  },
  {
    name: "f17468bffe382a2782426a57658178e8.jpg",
    key: "6xzVNiUiaeSrysqzrtmD1MjJ72mkWSdbPZcQyONswX5oAgHi",
    customId: null,
    url: "https://utfs.io/f/6xzVNiUiaeSrysqzrtmD1MjJ72mkWSdbPZcQyONswX5oAgHi",
    size: 81981,
    uploadedAt: "2024-10-22T20:26:29.000Z",
  },
  {
    name: "87158e22962e5029c9dd54eeb834e3e6.jpg",
    key: "6xzVNiUiaeSrqqxWgi56brHLw4BWsJpeDqGOkFvTIMcznNVg",
    customId: null,
    url: "https://utfs.io/f/6xzVNiUiaeSrqqxWgi56brHLw4BWsJpeDqGOkFvTIMcznNVg",
    size: 60930,
    uploadedAt: "2024-10-22T20:26:29.000Z",
  },
];

export default async function HomePage() {
  const posts = await db.query.posts.findMany();
  console.log(posts);
  return (
    <main>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {posts.map((post) => (
          <div key={post.id} className="w-40">
            <p>{post.name}</p>
            <p>Created {post.createdAt.toDateString()}</p>
          </div>
        ))}
        {[...mockImages, ...mockImages, ...mockImages].map((image, index) => (
          <div key={image.name + index} className="w-40">
            <a href={image.url}>
              <img src={image.url} alt={image.name} />
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
