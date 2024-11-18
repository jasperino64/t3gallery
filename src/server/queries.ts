import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";

export async function getMyImages() {
  const user = await auth();
  if (!user.userId) {
    throw new Error("Not authenticated");
  }
  const images = await db.query.images.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (image, { desc }) => desc(image.id),
  });
  return images;
}
