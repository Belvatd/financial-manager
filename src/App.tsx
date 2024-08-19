import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard, Login } from "./pages";
import { AuthProvider } from "./lib/helper/AuthProvider";
import ProtectedRoute from "./lib/helper/ProtectedRoute";

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
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
