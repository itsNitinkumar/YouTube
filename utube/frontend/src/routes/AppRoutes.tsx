import { Route, Routes, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Video from "../pages/Video"
import History from "../pages/History";
import Notification from "../pages/Notification
";
import type { JSX } from "react";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  // optional: wait for auth check
  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/video/:videoId"
        element={
          <ProtectedRoute>
            <Video />
          </ProtectedRoute>
        }
      />
      <Route  path= "/history" 
      element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute> 
      }/>
      <Route  path= "/notifications" 
      element={
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute> 
      }/>
        
    </Routes>
  );
}