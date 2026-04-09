import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { checkAuth } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log("App mounted - checking auth...");
    dispatch(checkAuth())
      .unwrap()
      .then((user) => {
        console.log("✅ Auth successful! User:", user);
      })
      .catch((error) => {
        console.log("❌ Auth failed:", error);
      });
  }, [dispatch]);

  console.log("App render - isAuthenticated:", isAuthenticated, "loading:", loading);

  return <AppRoutes />;
}