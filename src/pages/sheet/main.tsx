import ProtectedRoute from "@/lib/helper/ProtectedRoute";
import IncomeTable from "./fragments/SheetIncome/IncomeTable";
import { CardTitle } from "@/components/ui/card";
import BreadcrumbGroup from "@/components/ui-group/breadcrumb-group";
import FixedExpenseTable from "./fragments/SheetFixedExpense/FixedExpenseTable";

export default function Sheet() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6">
        <BreadcrumbGroup title="Sheet" />
        <CardTitle>Sheet</CardTitle>
        <IncomeTable />
        <FixedExpenseTable/>
      </div>
    </ProtectedRoute>
  );
}
