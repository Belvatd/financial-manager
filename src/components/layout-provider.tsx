import { useAuth } from "@/lib/helper/AuthProvider";
import { ReactNode } from "react";

export default function LayoutProvider({
  children,
  isMobile,
  isSidebarOpen,
}: {
  children: ReactNode;
  isMobile: boolean;
  isSidebarOpen: boolean;
}) {
  const { session } = useAuth();
  return (
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
      {children}
    </div>
  );
}
