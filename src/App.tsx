import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard, Login } from "./pages";
import { AuthProvider } from "./lib/helper/AuthProvider";
import ProtectedRoute from "./lib/helper/ProtectedRoute";
import { Books } from "./pages/books";
import QueryProvider from "./lib/helper/QueryProvider";
import Sidebar from "./components/ui-group/sidebar";
import { useEffect, useState } from "react";
import { useMediaQuery } from "./lib/helper/useMediaQuery";
import LayoutProvider from "./components/layout-provider";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "books",
        element: (
          <ProtectedRoute>
            <Books />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const menuList =
  router.routes[0]?.children
    ?.map((route) => {
      if (route.path === "" || route.path === "login") {
        return null;
      }
      return {
        name:
          (route?.path ?? "").charAt(0).toUpperCase() +
          (route?.path ?? "").slice(1),
        path: `/${route.path}`,
      };
    })
    .filter((item) => item !== null) ?? [];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const isMobile = useMediaQuery(768);

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
    else setIsSidebarOpen(true);
  }, [isMobile, setIsSidebarOpen]);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryProvider>
        <AuthProvider>
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
            menuList={menuList}
          />
          {
            <LayoutProvider isMobile={isMobile} isSidebarOpen={isSidebarOpen}>
              <RouterProvider router={router} />
            </LayoutProvider>
          }
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
