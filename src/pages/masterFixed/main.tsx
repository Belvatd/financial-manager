import { CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui-group/data-table";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Edit, Trash } from "lucide-react";
import DeleteConfirmModal from "./fragments/DeleteConfirmModal";
import ProtectedRoute from "@/lib/helper/ProtectedRoute";
import { TMasterFixedSchema } from "@/repositories/masterFixed/model";
import { useMasterFixedFindAll } from "@/repositories/masterFixed/service";
import MasterFixedFormAdd from "./fragments/MasterFixedAdd";
import MasterFixedFormEdit from "./fragments/MasterFixedEdit";
import { formatCurrency } from "@/lib/utils";

export default function MasterFixedExpense() {
  const { data: categoryData, isLoading } = useMasterFixedFindAll();
  const [dataIdEdit, setDataIdEdit] = useState<string>();
  const [dataIdDelete, setDataIdDelete] = useState<string>();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const columns: ColumnDef<TMasterFixedSchema>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Expense Name",
      },
      {
        accessorKey: "nominal",
        header: "Nominal",
        cell: (ctx) => formatCurrency(ctx.row.original.nominal as number),
      },
      {
        accessorKey: "master_category.name",
        header: "Category",
      },
      {
        accessorKey: "id",
        header: "",
        cell: (ctx) => {
          return (
            <div className="flex gap-2">
              <MasterFixedFormEdit
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
              </MasterFixedFormEdit>
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
          <CardTitle>Fixed Expense</CardTitle>
          <MasterFixedFormAdd
            open={openCreateModal}
            setOpen={setOpenCreateModal}
          >
            <Button variant="outline">New Fixed Expense</Button>
          </MasterFixedFormAdd>
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
