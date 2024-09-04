import { DataTable } from "@/components/ui-group/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TSheetIncomeSchema } from "@/repositories/sheetIncome/model";
import { useSheetIncomeFindAll } from "@/repositories/sheetIncome/service";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { Trash } from "lucide-react";
import SheetIncomeFormAdd from "./SheetIncomeAdd";

export default function IncomeTable() {
  const { id = "" } = useParams();
  const { data: incomeData, isLoading } = useSheetIncomeFindAll(id);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [dataIdDelete, setDataIdDelete] = useState<string>();

  const columns: ColumnDef<TSheetIncomeSchema>[] = useMemo(
    () => [
      {
        accessorKey: "master_income.name",
        header: "Income Source Name",
      },
      {
        accessorKey: "master_income.nominal",
        header: "Nominal",
      },
      {
        accessorKey: "id",
        header: "",
        cell: (ctx) => {
          return (
            <div className="flex gap-2">
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
    [dataIdDelete, openDeleteModal]
  );
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Income</CardTitle>
          <SheetIncomeFormAdd
            bookId={id}
            open={openCreateModal}
            setOpen={setOpenCreateModal}
          >
            <Button variant={"outline"}>Add Income From Variable</Button>
          </SheetIncomeFormAdd>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <DataTable
          loading={isLoading}
          columns={columns}
          data={(incomeData as TSheetIncomeSchema[]) ?? []}
        />
      </CardContent>
    </Card>
  );
}
