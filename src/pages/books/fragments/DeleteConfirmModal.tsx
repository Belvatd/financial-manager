import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteBook } from "@/repositories/books/service";
import { ReactNode, useEffect } from "react";

export default function DeleteConfirmModal({
  children,
  bookId,
  setBookId,
  open,
  setOpen,
}: {
  children: ReactNode;
  bookId: string;
  setBookId: (id: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  useEffect(() => {
    if (!open) {
      setBookId("");
    }
  }, [open, setBookId]);

  const {
    mutate: mutateDelete,
    isPending: isPendingDelete,
    error: errorDelete,
  } = useDeleteBook();

  async function onDelete(id: string) {
    try {
      mutateDelete(id);
      if (errorDelete) throw errorDelete;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[80dvw]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="pt-4">
            This action cannot be undone. This will permanently delete your book
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            data-testid="delete-button"
            className="w-full"
            onClick={() => onDelete(bookId)}
          >
            {isPendingDelete ? "Loading..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
