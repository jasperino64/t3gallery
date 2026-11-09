"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";

type TrashImage = {
  id: number;
  name: string;
  url: string;
};

type DeleteAction = (formData: FormData) => Promise<{ error?: string }>;

export function TrashImageManager({
  images,
  restoreAction,
  deleteAction,
}: {
  images: TrashImage[];
  restoreAction: (formData: FormData) => void | Promise<void>;
  deleteAction: DeleteAction;
}) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const allSelected = images.length > 0 && selectedIds.length === images.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isConfirmOpen && !dialog.open) dialog.showModal();
    if (!isConfirmOpen && dialog.open) dialog.close();
  }, [isConfirmOpen]);

  useEffect(() => {
    const availableIds = new Set(images.map(({ id }) => id));
    setSelectedIds((current) => current.filter((id) => availableIds.has(id)));
  }, [images]);

  function toggleImage(id: number) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  }

  return (
    <>
      <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <h1 className="text-2xl font-semibold">Trash</h1>
        {images.length > 0 ? (
          <div className="flex items-center justify-center gap-3">
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(event) =>
                  setSelectedIds(
                    event.currentTarget.checked
                      ? images.map(({ id }) => id)
                      : [],
                  )
                }
              />
              Select all
            </label>
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              {selectedIds.length} selected
            </span>
            <Button
              type="button"
              variant="destructive"
              disabled={selectedIds.length === 0}
              onClick={() => setIsConfirmOpen(true)}
            >
              Delete selected
            </Button>
          </div>
        ) : (
          <span />
        )}
        <Link href="/" className="justify-self-end text-sm underline">
          Back to gallery
        </Link>
      </div>

      {images.length === 0 ? (
        <p className="text-center">Your trash is empty.</p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-4">
          {images.map((image) => (
            <div key={image.id} className="flex w-40 flex-col gap-2">
              <label className="relative block cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(image.id)}
                  onChange={() => toggleImage(image.id)}
                  aria-label={`Select ${image.name}`}
                  className="absolute left-3 top-3 z-10 size-5 cursor-pointer rounded border-2 border-white bg-white accent-primary shadow-md ring-1 ring-black/40"
                />
                <Image
                  className="h-80 w-auto object-cover"
                  width={192}
                  height={192}
                  style={{ objectFit: "cover" }}
                  src={image.url}
                  alt={image.name}
                />
              </label>
              <div className="truncate text-center" title={image.name}>
                {image.name}
              </div>
              <form action={restoreAction}>
                <input type="hidden" name="imageId" value={image.id} />
                <Button type="submit" className="w-full">
                  Restore
                </Button>
              </form>
            </div>
          ))}
        </div>
      )}

      <form
        ref={deleteFormRef}
        action={async (formData) => {
          setIsDeleting(true);
          setDeleteError(null);
          const result = await deleteAction(formData);
          if (result.error) {
            setDeleteError(result.error);
            setIsDeleting(false);
            setIsConfirmOpen(true);
            return;
          }
          setSelectedIds([]);
          setIsDeleting(false);
          setIsConfirmOpen(false);
          router.refresh();
        }}
      >
        {selectedIds.map((id) => (
          <input key={id} type="hidden" name="imageId" value={id} />
        ))}
      </form>

      <dialog
        ref={dialogRef}
        aria-labelledby="delete-trash-title"
        className="m-auto w-[min(100%-2rem,24rem)] rounded-lg bg-background p-6 text-foreground shadow-lg backdrop:bg-black/70"
        onClose={() => setIsConfirmOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <div>
            <h2 id="delete-trash-title" className="text-lg font-semibold">
              Permanently delete {selectedIds.length}{" "}
              {selectedIds.length === 1 ? "image" : "images"}?
            </h2>
            <p className="text-sm text-muted-foreground">
              This also deletes the files and cannot be undone.
            </p>
            {deleteError && (
              <p role="alert" className="text-sm text-destructive">
                {deleteError}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                deleteFormRef.current?.requestSubmit();
              }}
            >
              {isDeleting ? "Deleting..." : "Delete permanently"}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
