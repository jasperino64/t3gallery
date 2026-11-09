"use client";

import { useRef } from "react";
import { Button } from "~/components/ui/button";

export function ConfirmDeleteButton({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <form
        ref={formRef}
        action={async (formData) => {
          await action(formData);
          window.location.replace("/");
        }}
      >
        <Button
          type="button"
          variant="destructive"
          onClick={() => dialogRef.current?.showModal()}
        >
          Delete
        </Button>
      </form>
      <dialog
        ref={dialogRef}
        aria-labelledby="delete-confirmation-title"
        className="m-auto w-[min(100%-2rem,24rem)] rounded-lg bg-background p-6 text-foreground shadow-lg backdrop:bg-black/70"
      >
        <div className="flex flex-col gap-4">
          <div>
            <h2
              id="delete-confirmation-title"
              className="text-lg font-semibold"
            >
              Delete this image?
            </h2>
            <p className="text-sm text-muted-foreground">
              This image will move to Trash, where you can restore it later.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
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
