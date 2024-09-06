import { DataTable } from "@/components/ui-group/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { Trash } from "lucide-react";
import SheetIncomeFormAdd from "./SheetIncomeAdd";
import { formatCurrency } from "@/lib/utils";
import { useSheetFixedExpenseFindAll } from "@/repositories/sheetFixedExpense/service";
import { TSheetFixedExpenseSchema } from "@/repositories/sheetFixedExpense/model";

export default function FixedExpenseTable() {
  const { id = "" } = useParams();
  const { data: fixedExpenseData, isLoading } = useSheetFixedExpenseFindAll(id);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [dataIdDelete, setDataIdDelete] = useState<string>();

  const columns: ColumnDef<TSheetFixedExpenseSchema>[] = useMemo(
    () => [
      {
        accessorKey: "master_fixed.name",
        header: "Fixed Expense Name",
      },
      {
        accessorKey: "master_fixed.nominal",
        header: "Nominal",
        cell: (ctx) =>
          formatCurrency(ctx.row.original.master_fixed?.nominal as number),
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
          <CardTitle>Fixed Expense</CardTitle>
          <SheetIncomeFormAdd
            bookId={id}
            open={openCreateModal}
            setOpen={setOpenCreateModal}
          >
            <Button variant={"outline"}>Add Fixed Expense From Variable</Button>
          </SheetIncomeFormAdd>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <DataTable
          loading={isLoading}
          columns={columns}
          data={(fixedExpenseData as TSheetFixedExpenseSchema[]) ?? []}
        />
      </CardContent>
    </Card>
  );
}
