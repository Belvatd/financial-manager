import { CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui-group/data-table";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Edit, Trash } from "lucide-react";
import DeleteConfirmModal from "./fragments/DeleteConfirmModal";
import ProtectedRoute from "@/lib/helper/ProtectedRoute";
import { TMasterCategorySchema } from "@/repositories/masterCategory/model";
import { useMasterCategoryFindAll } from "@/repositories/masterCategory/service";
import MasterCategoryFormEdit from "./fragments/MasterCategoryEdit";
import MasterCategoryFormAdd from "./fragments/MasterCategoryFormAdd";

export default function MasterCategory() {
  const { data: categoryData, isLoading } = useMasterCategoryFindAll();
  const [dataIdEdit, setDataIdEdit] = useState<string>();
  const [dataIdDelete, setDataIdDelete] = useState<string>();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const columns: ColumnDef<TMasterCategorySchema>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Source Name",
      },
      {
        accessorKey: "id",
        header: "",
        cell: (ctx) => {
          return (
            <div className="flex gap-2">
              <MasterCategoryFormEdit
                open={openEditModal}
                setOpen={setOpenEditModal}
                dataId={dataIdEdit ?? ""}
                setDataId={setDataIdEdit}
              >
                <Button
                  variant={"outline"}
                  onClick={() => setDataIdEdit(ctx.row.original.id)}
                >
                  <Edit size={20} />
                </Button>
              </MasterCategoryFormEdit>
              <DeleteConfirmModal
                open={openDeleteModal}
                setOpen={setOpenDeleteModal}
                dataId={dataIdDelete ?? ""}
                setDataId={setDataIdDelete}
              >
                <Button
                  variant={"outline"}
                  onClick={() => setDataIdDelete(ctx.row.original.id)}
                >
                  <Trash />
                </Button>
              </DeleteConfirmModal>
            </div>
          );
        },
      },
    ],
    [dataIdDelete, dataIdEdit, openDeleteModal, openEditModal]
  );
  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6">
        <div className="flex w-full justify-between items-center">
          <CardTitle>Category</CardTitle>
          <MasterCategoryFormAdd
            open={openCreateModal}
            setOpen={setOpenCreateModal}
          >
            <Button variant="outline">New Expense Category</Button>
          </MasterCategoryFormAdd>
        </div>
        <DataTable
          loading={isLoading}
          columns={columns}
          data={categoryData ?? []}
        />
      </div>
    </ProtectedRoute>
  );
}
