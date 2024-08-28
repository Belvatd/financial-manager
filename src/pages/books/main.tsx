import { CardTitle } from "@/components/ui/card";
import { useBookFindAll } from "@/repositories/books/service";
import { ColumnDef } from "@tanstack/react-table";
import { TBookSchema } from "@/repositories/books/model";
import { DataTable } from "@/components/ui-group/data-table";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import BookFormAdd from "./fragments/BookFormAdd";
import BookFormEdit from "./fragments/BookFormEdit";
import { Edit, Sheet, Trash } from "lucide-react";
import DeleteConfirmModal from "./fragments/DeleteConfirmModal";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "@/lib/helper/ProtectedRoute";

export default function Books() {
  const { data: booksData, isLoading } = useBookFindAll();
  const [bookIdEdit, setBookIdEdit] = useState<string>();
  const [bookIdDelete, setBookIdDelete] = useState<string>();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const navigate = useNavigate();

  const columns: ColumnDef<TBookSchema>[] = useMemo(
    () => [
      {
        accessorKey: "book_name",
        header: "Name",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "start_period",
        header: "Start Period",
      },
      {
        accessorKey: "end_period",
        header: "End Period",
      },
      {
        accessorKey: "id",
        header: "",
        cell: (ctx) => {
          return (
            <div className="flex gap-2">
              <BookFormEdit
                open={openEditModal}
                setOpen={setOpenEditModal}
                bookId={bookIdEdit ?? ""}
                setBookId={setBookIdEdit}
              >
                <Button
                  variant={"outline"}
                  onClick={() => setBookIdEdit(ctx.row.original.id)}
                >
                  <Edit size={20} />
                </Button>
              </BookFormEdit>
              <DeleteConfirmModal
                open={openDeleteModal}
                setOpen={setOpenDeleteModal}
                bookId={bookIdDelete ?? ""}
                setBookId={setBookIdDelete}
              >
                <Button
                  variant={"outline"}
                  onClick={() => setBookIdDelete(ctx.row.original.id)}
                >
                  <Trash />
                </Button>
              </DeleteConfirmModal>
              <Button
                variant={"outline"}
                onClick={() => navigate(`/books/sheet/${ctx.row.original.id}`)}
              >
                <Sheet size={20} />
              </Button>
            </div>
          );
        },
      },
    ],
    [bookIdDelete, bookIdEdit, navigate, openDeleteModal, openEditModal]
  );
  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6">
        <div className="flex w-full justify-between items-center">
          <CardTitle>Books</CardTitle>
          <BookFormAdd open={openCreateModal} setOpen={setOpenCreateModal}>
            <Button variant="outline">New Book</Button>
          </BookFormAdd>
        </div>
        <DataTable
          loading={isLoading}
          columns={columns}
          data={booksData ?? []}
        />
      </div>
    </ProtectedRoute>
  );
}
