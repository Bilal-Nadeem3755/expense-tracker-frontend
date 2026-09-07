import {
  LayoutDashboard,
  Receipt,
  Tags,
  BarChart3,
  Settings,
  WalletCards,
  X,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import api from "../services/api";


const Sidebar = ({
  isOpen,
  onClose,
  currentUser,
}) => {

  const navigate = useNavigate();


  // ==========================================
  // Menu Items
  // ==========================================

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: Receipt,
    },
    {
      name: "Categories",
      path: "/categories",
      icon: Tags,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];


  // ==========================================
  // User Information
  // ==========================================

  const userName =
    currentUser?.name || "User";


  const userEmail =
    currentUser?.email ||
    "user@example.com";


  const userInitials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();


  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = async () => {

    try {

      await api.post("/users/logout");

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

    } finally {


      // ========================================
      // Remove JWT
      // ========================================

      localStorage.removeItem(
        "access_token"
      );


      // ========================================
      // Clear Current User in App
      // ========================================

      window.dispatchEvent(
        new Event("auth-changed")
      );


      // ========================================
      // Close Mobile Sidebar
      // ========================================

      onClose();


      // ========================================
      // Go To Login
      // ========================================

      navigate("/login", {
        replace: true,
      });

    }

  };


  // ==========================================
  // JSX
  // ==========================================

  return (
    <>


      {/* ======================================
          Mobile Overlay
      ====================================== */}

      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/40
          transition-opacity duration-300
          lg:hidden

          ${
            isOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      />


      {/* ======================================
          Sidebar
      ====================================== */}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-64 flex-col
          bg-slate-950 text-white
          transition-transform duration-300
          lg:translate-x-0

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >


        {/* ====================================
            Logo
        ==================================== */}

        <div className="flex h-20 items-center justify-between px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">

              <WalletCards
                size={22}
                strokeWidth={2.2}
              />

            </div>


            <div>

              <h1 className="text-lg font-semibold leading-tight">
                Expense
              </h1>

              <p className="text-sm font-medium text-slate-400">
                Tracker
              </p>

            </div>

          </div>


          {/* Mobile Close */}

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

        </div>


        {/* Divider */}

        <div className="mx-5 border-t border-slate-800" />


        {/* ====================================
            Navigation
        ==================================== */}

        <nav className="flex-1 px-4 py-6">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Menu
          </p>


          <div className="space-y-1">

            {menuItems.map((item) => {

              const Icon = item.icon;


              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3
                    rounded-lg px-3 py-3
                    text-sm font-medium
                    transition-all duration-200

                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }
                    `
                  }
                >

                  <Icon
                    size={19}
                    strokeWidth={2}
                  />

                  <span>
                    {item.name}
                  </span>

                </NavLink>
              );

            })}

          </div>

        </nav>


        {/* ====================================
            User Section
        ==================================== */}

        <div className="border-t border-slate-800 p-4">

          <div className="flex items-center gap-3 rounded-lg px-2 py-3">


            {/* Avatar */}

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold">

              {userInitials}

            </div>


            {/* User Info */}

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-medium text-white">
                {userName}
              </p>

              <p className="truncate text-xs text-slate-500">
                {userEmail}
              </p>

            </div>


            {/* Logout */}

            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-red-400"
              title="Logout"
              aria-label="Logout"
            >

              <LogOut size={18} />

            </button>

          </div>

        </div>

      </aside>

    </>
  );
};


export default Sidebar;