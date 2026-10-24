import { RouterProvider } from "react-router/dom";
import { router } from "./routes";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../features/auth/AuthContext";

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
