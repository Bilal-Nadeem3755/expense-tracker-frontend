import { useEffect, useState } from "react";

import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Transactions from "./pages/Transactions";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import api from "./services/api";


// ==========================================
// Protected Route
// ==========================================

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// ==========================================
// App
// ==========================================

function App() {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [loadingUser, setLoadingUser] = useState(true);


  // ==========================================
  // Get Current User
  // ==========================================

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("access_token");

    // ----------------------------------------
    // No token
    // ----------------------------------------

    if (!token) {
      setCurrentUser(null);
      setLoadingUser(false);

      return;
    }

    try {
      setLoadingUser(true);

      const response = await api.get("/users/me");

      setCurrentUser(response.data);

    } catch (error) {
      console.error(
        "Failed to fetch current user:",
        error
      );

      // --------------------------------------
      // Invalid / expired token
      // --------------------------------------

      localStorage.removeItem("access_token");

      setCurrentUser(null);

    } finally {
      setLoadingUser(false);
    }
  };


  // ==========================================
  // Initial Auth Check
  // ==========================================

  useEffect(() => {
    fetchCurrentUser();
  }, []);


  // ==========================================
  // Listen For Auth Changes
  // ==========================================

  useEffect(() => {
    const handleAuthChange = () => {
      fetchCurrentUser();
    };

    window.addEventListener(
      "auth-changed",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "auth-changed",
        handleAuthChange
      );
    };
  }, []);


  // ==========================================
  // Close Sidebar on Route Change
  // ==========================================

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);


  // ==========================================
  // Loading
  // ==========================================

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading...
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // JSX
  // ==========================================

  return (
    <Routes>

      {/* ======================================
          Public Routes
      ====================================== */}

      <Route
        path="/login"
        element={
          localStorage.getItem("access_token") ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/register"
        element={
          localStorage.getItem("access_token") ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Register />
          )
        }
      />


      {/* ======================================
          Protected Routes
      ====================================== */}

      <Route
        path="/*"
        element={

          <ProtectedRoute>

            <div className="min-h-screen bg-slate-50">

              <div className="flex min-h-screen">

                {/* ==================================
                    Sidebar
                ================================== */}

                <Sidebar
                  isOpen={sidebarOpen}
                  onClose={() =>
                    setSidebarOpen(false)
                  }
                  currentUser={currentUser}
                />


                {/* ==================================
                    Main Content
                ================================== */}

                <div className="min-w-0 flex-1 lg:ml-64">

                  {/* Navbar */}

                  <Navbar
                    onMenuClick={() =>
                      setSidebarOpen(true)
                    }
                    currentUser={currentUser}
                  />


                  {/* ==================================
                      Pages
                  ================================== */}

                  <Routes>

                    <Route
                      path="/dashboard"
                      element={<Dashboard />}
                    />

                    <Route
                      path="/categories"
                      element={<Categories />}
                    />

                    <Route
                      path="/transactions"
                      element={<Transactions />}
                    />

                    <Route
                      path="/reports"
                      element={<Reports />}
                    />

                    <Route
                      path="/settings"
                      element={<Settings />}
                    />

                    <Route
                      path="*"
                      element={
                        <Navigate
                          to="/dashboard"
                          replace
                        />
                      }
                    />

                  </Routes>

                </div>

              </div>

            </div>

          </ProtectedRoute>

        }
      />

    </Routes>
  );
}


export default App;