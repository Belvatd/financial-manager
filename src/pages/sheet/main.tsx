import ProtectedRoute from "@/lib/helper/ProtectedRoute";
import IncomeTable from "./fragments/SheetIncome/IncomeTable";
import { CardTitle } from "@/components/ui/card";
import BreadcrumbGroup from "@/components/ui-group/breadcrumb-group";
import FixedExpenseTable from "./fragments/SheetFixedExpense/FixedExpenseTable";
import VariableExpenseTable from "./fragments/SheetVariableExpense/VariableExpenseTable";
import { useParams } from "react-router-dom";
import { useBookFindById } from "@/repositories/books/service";
import InterestTable from "./fragments/SheetInterest/InterestTable";

export default function Sheet() {
  const { id = "" } = useParams();
  const { data: bookData } = useBookFindById(id);
  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6">
        <BreadcrumbGroup title={`Sheet ${bookData?.book_name}`} />
        <CardTitle>Sheet {bookData?.book_name}</CardTitle>
        <IncomeTable />
        <FixedExpenseTable />
        <VariableExpenseTable />
        <InterestTable />
      </div>
    </ProtectedRoute>
  );
}
