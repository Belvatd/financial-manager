import { useAuth } from "@/lib/helper/AuthProvider";
import Sidebar from "./ui-group/sidebar";
import { Outlet } from "react-router-dom";
import { memo, Suspense, useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/helper/useMediaQuery";

function LayoutProvider({
  menuList,
}: {
  menuList: { name: string; path: string }[];
}) {
  const { session } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useMediaQuery(768);

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
    else setIsSidebarOpen(true);
  }, [isMobile, setIsSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        menuList={menuList}
      />
      <div
        className={
          !session
            ? ""
            : `pt-[9dvh] min-h-[100dvh] bg-background p-4
          ${
            isMobile
              ? "w-[100dvw]"
              : `transition-transform transform ${
                  isSidebarOpen
                    ? "translate-x-[10dvw] w-[90dvw]"
                    : "translate-x-0 w-[100dvw]"
                }`
          }`
        }
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

export default memo(LayoutProvider);
