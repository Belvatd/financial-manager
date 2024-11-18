import { DataTable } from "@/components/ui-group/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { Trash } from "lucide-react";
import SheetVariableExpenseFormAdd from "./SheetVariableExpenseAdd";
import { formatCurrency } from "@/lib/utils";
import { useSheetVariableExpenseFindAll } from "@/repositories/sheetVariableExpense/service";
import { TSheetVariableExpenseSchema } from "@/repositories/sheetVariableExpense/model";

export default function VariableExpenseTable() {
  const { id = "" } = useParams();
  const { data: variableExpenseData, isLoading } = useSheetVariableExpenseFindAll(id);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [dataIdDelete, setDataIdDelete] = useState<string>();

  const columns: ColumnDef<TSheetVariableExpenseSchema>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Fixed Expense Name",
      },
      {
        accessorKey: "nominal",
        header: "Nominal",
        cell: (ctx) =>
          formatCurrency(ctx.row.original.nominal as number),
      },
      {
        accessorKey: "date",
        header: "Date",
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
          <CardTitle>Variable Expense</CardTitle>
          <SheetVariableExpenseFormAdd
            bookId={id}
            open={openCreateModal}
            setOpen={setOpenCreateModal}
          >
            <Button variant={"outline"}>Add Variable Expense</Button>
          </SheetVariableExpenseFormAdd>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <DataTable
          loading={isLoading}
          columns={columns}
          data={(variableExpenseData as TSheetVariableExpenseSchema[]) ?? []}
        />
      </CardContent>
    </Card>
  );
}
