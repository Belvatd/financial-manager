import { Button } from "@/components/ui/button";
import { supabaseClient } from "@/lib/helper/supabaseClient";

export default function Dashboard() {
  const Logout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={Logout}>Logout</Button>
    </div>
  );
}
