"use server";
import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { images } from "./db/schema";
import { and, count, eq, inArray, isNotNull, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import analyticsServerClient from "./analytics";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function getMyImages() {
  const user = await auth();

  if (!user.userId) throw new Error("Unauthorized");

  const images = await db.query.images.findMany({
    where: (model, { and, eq, isNull }) =>
      and(eq(model.userId, user.userId), isNull(model.deletedAt)),
    orderBy: (model, { desc }) => desc(model.id),
  });

  return images;
}

export async function getMyImageCount() {
  const user = await auth();
  if (!user.userId) return 0;

  const [result] = await db
    .select({ count: count() })
    .from(images)
    .where(and(eq(images.userId, user.userId), isNull(images.deletedAt)));

  return result?.count ?? 0;
}

export async function getMyTrashedImages() {
  const user = await auth();

  if (!user.userId) throw new Error("Unauthorized");

  return db.query.images.findMany({
    where: (model, { and, eq, isNotNull }) =>
      and(eq(model.userId, user.userId), isNotNull(model.deletedAt)),
    orderBy: (model, { desc }) => desc(model.deletedAt),
  });
}

export async function getMyTrashCount() {
  const user = await auth();
  if (!user.userId) return 0;

  const [result] = await db
    .select({ count: count() })
    .from(images)
    .where(and(eq(images.userId, user.userId), isNotNull(images.deletedAt)));

  return result?.count ?? 0;
}

export async function getImage(id: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const image = await db.query.images.findFirst({
    where: (model, { and, eq, isNull }) =>
      and(eq(model.id, id), isNull(model.deletedAt)),
  });
  if (!image) redirect("/");

  if (image.userId !== user.userId) throw new Error("Unauthorized");

  return image;
}

export async function renameImage(id: number, name: string) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("Invalid image id");
  }
  if (typeof name !== "string") {
    throw new Error("Image name is required");
  }

  const trimmedName = name.trim();
  if (!trimmedName || trimmedName.length > 256) {
    throw new Error("Image name must be between 1 and 256 characters");
  }

  const [image] = await db
    .update(images)
    .set({ name: trimmedName })
    .where(
      and(
        eq(images.id, id),
        eq(images.userId, user.userId),
        isNull(images.deletedAt),
      ),
    )
    .returning({ id: images.id });

  if (!image) throw new Error("Unauthorized");

  revalidatePath("/");
  revalidatePath(`/img/${id}`);
}

export async function deleteImage(id: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const [image] = await db
    .update(images)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(images.id, id),
        eq(images.userId, user.userId),
        isNull(images.deletedAt),
      ),
    )
    .returning({ id: images.id });

  if (!image) throw new Error("Image not found or unauthorized");

  analyticsServerClient.capture({
    distinctId: user.userId,
    event: "delete image",
    properties: {
      imageId: id,
    },
  });
  revalidatePath("/", "page");
  revalidatePath("/", "layout");
  revalidatePath("/trash");
}

export async function restoreImage(id: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const [image] = await db
    .update(images)
    .set({ deletedAt: null })
    .where(
      and(
        eq(images.id, id),
        eq(images.userId, user.userId),
        isNotNull(images.deletedAt),
      ),
    )
    .returning({ id: images.id });

  if (!image) redirect("/trash");

  revalidatePath("/", "page");
  revalidatePath("/", "layout");
  revalidatePath("/trash");
}

export async function permanentlyDeleteTrashedImages(ids: number[]) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const uniqueIds = [...new Set(ids)];
  if (
    uniqueIds.length === 0 ||
    uniqueIds.some((id) => !Number.isSafeInteger(id) || id < 1)
  ) {
    throw new Error("Invalid image selection");
  }

  const trashedImages = await db.query.images.findMany({
    where: (model, { and, eq, inArray, isNotNull }) =>
      and(
        eq(model.userId, user.userId),
        inArray(model.id, uniqueIds),
        isNotNull(model.deletedAt),
      ),
  });

  if (trashedImages.length !== uniqueIds.length) {
    throw new Error("One or more selected images are unavailable");
  }

  const fileKeys = trashedImages.map((image) => {
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

    return decodeURIComponent(fileKey);
  });

  const { success } = await utapi.deleteFiles(fileKeys);
  if (!success) throw new Error("Failed to delete selected files from UploadThing");

  await db
    .delete(images)
    .where(
      and(
        eq(images.userId, user.userId),
        inArray(images.id, uniqueIds),
        isNotNull(images.deletedAt),
      ),
    );

  revalidatePath("/trash");
  revalidatePath("/", "layout");
}
