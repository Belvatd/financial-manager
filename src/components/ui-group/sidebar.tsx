import { Button } from "../ui/button";
import { LogOutIcon, MenuIcon } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { supabaseClient } from "@/lib/helper/supabaseClient";
import { useAuth } from "@/lib/helper/AuthProvider";
import { Link } from "react-router-dom";

const NavBar = ({
  toggleSidebar,
  handleLogout,
}: {
  toggleSidebar: () => void;
  handleLogout: () => void;
}) => {
  return (
    <div className="fixed h-[7dvh] top-0 left-0 w-[100dvw] bg-background border-b z-50 flex justify-between items-center p-4">
      <div className="flex items-center w-full">
        <Button
          variant={"outline"}
          onClick={toggleSidebar}
          className="text-2xl"
        >
          <MenuIcon width={20} />
        </Button>
        <div className="flex justify-between w-full">
          <h1 className="ml-4 text-2xl font-bold">My App</h1>
          <div className="flex align-middle gap-2">
            <Button variant={"outline"} onClick={handleLogout}>
              <LogOutIcon width={20} />
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({
  isOpen,
  toggleSidebar,
  isMobile,
  menuList,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  menuList: { name: string; path: string }[];
}) => {
  const { session } = useAuth();

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  };

  return (
    <div>
      <NavBar toggleSidebar={toggleSidebar} handleLogout={handleLogout} />
      <div
        className={`fixed z-40 pt-[7dvh] left-0 min-h-[100dvh] bg-background transition-transform transform border-r ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isMobile ? "w-[40dvw]" : "w-[10dvw]"}`}
      >
        <ul className="mt-4">
          {menuList.map((item) => (
            <Link key={item?.name} to={item?.path}>
              <li className="py-2 px-4 cursor-pointer hover:backdrop-brightness-95 text-foreground hover:text-foreground">
                {item?.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
