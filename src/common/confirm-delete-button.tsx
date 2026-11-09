"use client";

import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useRef } from "react";
import { Button } from "~/components/ui/button";

function DeletePendingOverlay() {
  const { pending } = useFormStatus();

  if (!pending) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-black/70 text-sm font-medium text-white backdrop-blur-sm"
    >
      <LoaderCircle
        aria-hidden="true"
        className="size-8 animate-spin text-violet-300"
      />
      <span>Moving photo to Trash…</span>
    </div>
  );
}

export function ConfirmDeleteButton({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  return (
    <>
      <form
        ref={formRef}
        action={async (formData) => {
          await action(formData);
          router.replace("/");
        }}
      >
        <DeletePendingOverlay />
        <Button
          type="button"
          variant="destructive"
          className="h-11 w-full rounded-xl"
          onClick={() => dialogRef.current?.showModal()}
        >
          <Trash2 aria-hidden="true" />
          Delete
        </Button>
      </form>
      <dialog
        ref={dialogRef}
        aria-labelledby="delete-confirmation-title"
        className="m-auto w-[min(100%-2rem,26rem)] rounded-2xl border border-white/10 bg-[#1a191f] p-6 text-white shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
              <AlertTriangle aria-hidden="true" className="size-5" />
            </div>
            <h2
              id="delete-confirmation-title"
              className="text-lg font-semibold"
            >
              Move this image to Trash?
            </h2>
            <p className="mt-2 text-sm text-white/55">
              This image will move to Trash, where you can restore it later.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              onClick={() => {
                formRef.current?.requestSubmit();
                dialogRef.current?.close();
              }}
            >
              Delete image
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
