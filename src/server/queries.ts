import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { images } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { redirect, RedirectType } from "next/navigation";

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

export async function getImage(id: number) {
  const user = await auth();
  if (!user.userId) {
    throw new Error("Not authenticated");
  }
  const image = await db.query.images.findFirst({
    where: (model, { and, eq }) =>
      and(eq(model.userId, user.userId), eq(model.id, id)),
  });
  if (!image) {
    throw new Error("Image not found");
  }

  return image;
}

export async function deleteImage(id: number) {
  const user = await auth();
  if (!user.userId) {
    throw new Error("Unauthorized");
  }

  await db
    .delete(images)
    .where(and(eq(images.id, id), eq(images.userId, user.userId)));

  redirect("/", RedirectType.replace);
}
