import { Route, Routes, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Video from "../pages/Video";
import History from "../pages/History";
import Notification from "../pages/Notification";
import UploadVideo from "../pages/UploadVideo";
import Sidebar from "../components/Sidebar";
import type { JSX } from "react";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function Layout({ children }: { children: JSX.Element }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">{children}</main>
    </div>
  );
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
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Layout>
              <UploadVideo />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/video/:videoId"
        element={
          <ProtectedRoute>
            <Layout>
              <Video />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <Layout>
              <History />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <Notification />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}