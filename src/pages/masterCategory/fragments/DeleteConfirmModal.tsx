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
import { useDeleteMasterCategory } from "@/repositories/masterCategory/service";
import { ReactNode, useEffect } from "react";

export default function DeleteConfirmModal({
  children,
  dataId,
  setDataId,
  open,
  setOpen,
}: {
  children: ReactNode;
  dataId: string;
  setDataId: (id: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  useEffect(() => {
    if (!open) {
      setDataId("");
    }
  }, [open, setDataId]);

  const {
    mutate: mutateDelete,
    isPending: isPendingDelete,
    error: errorDelete,
  } = useDeleteMasterCategory();

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
            This action cannot be undone. This will permanently delete your
            expense category and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className="w-full" onClick={() => onDelete(dataId)}>
            {isPendingDelete ? "Loading..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
