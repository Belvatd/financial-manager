import { CardTitle } from "@/components/ui/card";
import ProtectedRoute from "@/lib/helper/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <CardTitle>Dashboard</CardTitle>
    </ProtectedRoute>
  );
}
