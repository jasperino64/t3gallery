"use server";
import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { images } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import analyticsServerClient from "./analytics";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function getMyImages() {
  const user = await auth();

  if (!user.userId) throw new Error("Unauthorized");

  const images = await db.query.images.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });

  return images;
}

export async function getImage(id: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const image = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });
  if (!image) throw new Error("Image not found");

  if (image.userId !== user.userId) throw new Error("Unauthorized");

  return image;
}

export async function deleteImage(id: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const image = await db.query.images.findFirst({
    where: (model, { and, eq }) =>
      and(eq(model.id, id), eq(model.userId, user.userId)),
  });
  if (!image) throw new Error("Image not found");

  const imageUrl = new URL(image.url);
  const hostname = imageUrl.hostname;
  const isUploadThingHost =
    imageUrl.protocol === "https:" &&
    (hostname === "utfs.io" ||
      hostname === "ufs.sh" ||
      hostname.endsWith(".ufs.sh") ||
      hostname === "uploadthing.com" ||
      hostname.endsWith(".uploadthing.com"));
  const fileKey = /^\/f\/([^/]+)\/?$/.exec(imageUrl.pathname)?.[1];

  if (!isUploadThingHost || !fileKey) {
    throw new Error("Unable to determine UploadThing file key");
  }

  const { success } = await utapi.deleteFiles(decodeURIComponent(fileKey));
  if (!success) throw new Error("Failed to delete file from UploadThing");

  await db
    .delete(images)
    .where(and(eq(images.id, id), eq(images.userId, user.userId)));

  analyticsServerClient.capture({
    distinctId: user.userId,
    event: "delete image",
    properties: {
      imageId: id,
    },
  });
  redirect("/");
}
