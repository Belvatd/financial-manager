import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard, Login } from "./pages";
import { AuthProvider } from "./lib/helper/AuthProvider";
import ProtectedRoute from "./lib/helper/ProtectedRoute";
import { Books } from "./pages/books";
import QueryProvider from "./lib/helper/QueryProvider";

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

function App() {
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
