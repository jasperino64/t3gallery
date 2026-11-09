"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ImageOff,
  LoaderCircle,
  RotateCcw,
  Trash2,
} from "lucide-react";
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
  restoreSelectedAction,
  deleteAction,
}: {
  images: TrashImage[];
  restoreAction: (formData: FormData) => void | Promise<void>;
  restoreSelectedAction: (formData: FormData) => void | Promise<void>;
  deleteAction: DeleteAction;
}) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
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
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-violet-300">
            RECENTLY DELETED
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Trash
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Restore photos you still want, or permanently remove the ones you
            don’t.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-foreground/75 transition hover:bg-white/[0.08] hover:text-foreground sm:self-auto"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to gallery
        </Link>
      </header>

      {images.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
            <ImageOff aria-hidden="true" className="size-7" />
          </div>
          <h2 className="mt-5 text-xl font-semibold">All clear</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Nothing in the trash. Photos you delete will show up here and can be
            restored anytime.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 sm:px-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium">
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
                  className="size-4 cursor-pointer rounded accent-violet-500"
                />
                Select all
              </label>
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} of {images.length} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <form
                action={async (formData) => {
                  setIsRestoring(true);
                  try {
                    await restoreSelectedAction(formData);
                    setSelectedIds([]);
                    router.refresh();
                  } finally {
                    setIsRestoring(false);
                  }
                }}
              >
                {selectedIds.map((id) => (
                  <input key={id} type="hidden" name="imageId" value={id} />
                ))}
                <Button
                  type="submit"
                  variant="outline"
                  className="h-9 rounded-lg border-white/10 bg-white/[0.03] px-3 text-foreground hover:bg-violet-500/10 hover:text-violet-200"
                  disabled={selectedIds.length === 0 || isRestoring}
                >
                  {isRestoring ? (
                    <LoaderCircle aria-hidden="true" className="animate-spin" />
                  ) : (
                    <RotateCcw aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">
                    {isRestoring ? "Restoring..." : "Restore selected"}
                  </span>
                  <span className="sm:hidden">
                    {isRestoring ? "Restoring..." : "Restore"}
                  </span>
                </Button>
              </form>
              <Button
                type="button"
                variant="destructive"
                className="h-9 rounded-lg px-3"
                disabled={selectedIds.length === 0}
                onClick={() => setIsConfirmOpen(true)}
              >
                <Trash2 aria-hidden="true" />
                <span className="hidden sm:inline">Delete selected</span>
                <span className="sm:hidden">Delete</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
            {images.map((image) => {
              const isSelected = selectedIds.includes(image.id);

              return (
                <div
                  key={image.id}
                  className={`group overflow-hidden rounded-2xl border bg-card transition ${
                    isSelected
                      ? "border-violet-400/60 ring-1 ring-violet-400/30"
                      : "border-white/[0.08] hover:border-white/20"
                  }`}
                >
                  <label className="relative block aspect-square cursor-pointer overflow-hidden bg-muted">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleImage(image.id)}
                      aria-label={`Select ${image.name}`}
                      className="absolute left-3 top-3 z-10 size-5 cursor-pointer rounded accent-violet-500 shadow-md ring-2 ring-black/30"
                    />
                    <Image
                      className={`object-contain transition duration-300 ${
                        isSelected ? "opacity-75" : ""
                      }`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, (max-width: 1536px) 17vw, 13vw"
                      src={image.url}
                      alt={image.name}
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 pb-3 pt-10 text-sm font-medium text-white">
                      <span className="block truncate" title={image.name}>
                        {image.name}
                      </span>
                    </span>
                  </label>
                  <div className="p-3">
                    <form action={restoreAction}>
                      <input type="hidden" name="imageId" value={image.id} />
                      <Button
                        type="submit"
                        variant="outline"
                        className="h-10 w-full rounded-xl border-white/10 bg-white/[0.03] text-sm text-foreground hover:bg-violet-500/10 hover:text-violet-200"
                      >
                        <RotateCcw aria-hidden="true" />
                        Restore photo
                      </Button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </>
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
        className="m-auto w-[min(100%-2rem,26rem)] rounded-2xl border border-white/10 bg-[#1a191f] p-6 text-white shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
        onClose={() => setIsConfirmOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
              <AlertTriangle aria-hidden="true" className="size-5" />
            </div>
            <h2 id="delete-trash-title" className="text-lg font-semibold">
              Permanently delete {selectedIds.length}{" "}
              {selectedIds.length === 1 ? "image" : "images"}?
            </h2>
            <p className="mt-2 text-sm text-white/55">
              This also deletes the files and cannot be undone.
            </p>
            {deleteError && (
              <p role="alert" className="mt-3 text-sm text-red-300">
                {deleteError}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white"
              disabled={isDeleting}
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              disabled={isDeleting}
              onClick={() => {
                deleteFormRef.current?.requestSubmit();
              }}
            >
              <Trash2 aria-hidden="true" />
              {isDeleting ? "Deleting..." : "Delete permanently"}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
