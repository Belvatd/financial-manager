import { CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui-group/data-table";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Edit, Trash } from "lucide-react";
import DeleteConfirmModal from "./fragments/DeleteConfirmModal";
import ProtectedRoute from "@/lib/helper/ProtectedRoute";
import { useMasterIncomeFindAll } from "@/repositories/masterIncome/service";
import MasterIncomeFormAdd from "./fragments/MasterIncomeFormAdd";
import MasterIncomeFormEdit from "./fragments/MasterIncomeFormEdit";
import { TMasterIncomeSchema } from "@/repositories/masterIncome/model";
import { formatCurrency } from "@/lib/utils";

export default function MasterIncome() {
  const { data: incomeData, isLoading } = useMasterIncomeFindAll();
  const [dataIdEdit, setDataIdEdit] = useState<string>();
  const [dataIdDelete, setDataIdDelete] = useState<string>();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const columns: ColumnDef<TMasterIncomeSchema>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Source Name",
      },
      {
        accessorKey: "nominal",
        header: "Nominal",
        cell: (ctx) => formatCurrency(ctx.row.original.nominal as number),
      },
      {
        accessorKey: "id",
        header: "",
        cell: (ctx) => {
          return (
            <div className="flex gap-2">
              <MasterIncomeFormEdit
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
              </MasterIncomeFormEdit>
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
          <CardTitle>Income</CardTitle>
          <MasterIncomeFormAdd
            open={openCreateModal}
            setOpen={setOpenCreateModal}
          >
            <Button variant="outline">New Income Source</Button>
          </MasterIncomeFormAdd>
        </div>
        <DataTable
          loading={isLoading}
          columns={columns}
          data={incomeData ?? []}
        />
      </div>
    </ProtectedRoute>
  );
}
