import { DataTable } from "@/components/ui-group/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { Trash } from "lucide-react";
import SheetInterestFormAdd from "./SheetInterestAdd";
import { formatCurrency } from "@/lib/utils";
import { useSheetInterestFindAll } from "@/repositories/sheetInterest/service";
import { TSheetInterestSchema } from "@/repositories/sheetInterest/model";

export default function InterestTable() {
  const { id = "" } = useParams();
  const { data: interestData, isLoading } = useSheetInterestFindAll(id);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [dataIdDelete, setDataIdDelete] = useState<string>();

  const columns: ColumnDef<TSheetInterestSchema>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Interest Name",
      },
      {
        accessorKey: "nominal",
        header: "Nominal",
        cell: (ctx) =>
          formatCurrency(ctx.row.original.nominal as number),
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
          <CardTitle>Interest</CardTitle>
          <SheetInterestFormAdd
            bookId={id}
            open={openCreateModal}
            setOpen={setOpenCreateModal}
          >
            <Button variant={"outline"}>Add Interest</Button>
          </SheetInterestFormAdd>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <DataTable
          loading={isLoading}
          columns={columns}
          data={(interestData as TSheetInterestSchema[]) ?? []}
        />
      </CardContent>
    </Card>
  );
}
