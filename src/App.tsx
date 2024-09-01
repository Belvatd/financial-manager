import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./lib/helper/AuthProvider";
import QueryProvider from "./lib/helper/QueryProvider";
import { useMemo } from "react";
import LayoutProvider from "./components/layout-provider";

const routes = [
  {
    index: true,
    lazy: async () =>
      await import("./pages").then(({ Login }) => ({
        Component: Login,
      })),
  },
  {
    path: "login",
    lazy: async () =>
      await import("./pages").then(({ Login }) => ({
        Component: Login,
      })),
  },
  {
    path: "dashboard",
    lazy: async () =>
      await import("./pages").then(({ Dashboard }) => {
        return { Component: Dashboard };
      }),
  },
  {
    path: "books",
    children: [
      {
        index: true,
        lazy: async () =>
          await import("./pages").then(({ Books }) => {
            return {
              Component: Books,
            };
          }),
      },
      {
        path: "sheet/:id",
        lazy: async () =>
          await import("./pages").then(({ Books }) => {
            return {
              Component: Books,
            };
          }),
      },
    ],
  },
  {
    path: "income",
    children: [
      {
        index: true,
        lazy: async () =>
          await import("./pages").then(({ MasterIncome }) => {
            return {
              Component: MasterIncome,
            };
          }),
      },
    ],
  },
  {
    path: "category",
    children: [
      {
        index: true,
        lazy: async () =>
          await import("./pages").then(({ MasterCategory }) => {
            return {
              Component: MasterCategory,
            };
          }),
      },
    ],
  },
];

const menuList =
  routes
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
  const router = useMemo(() => {
    return createBrowserRouter([
      {
        path: "/",
        element: <LayoutProvider menuList={menuList} />,
        children: routes,
      },
    ]);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
