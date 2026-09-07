import {
  Menu,
  Sparkles,
} from "lucide-react";


const Navbar = ({
  onMenuClick,
  currentUser,
}) => {

  // ==========================================
  // User Information
  // ==========================================

  const userName =
    currentUser?.name || "User";


  const userInitials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();



  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">

      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">


        {/* ====================================
            Left Side
        ==================================== */}

        <div className="flex items-center gap-4">


          {/* Mobile Menu */}

          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>


          {/* Page Heading */}

          <div>

            <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Manage Your Expense
            </h1>


            <p className="hidden text-sm text-slate-500 sm:block">
              Welcome back, {userName}
            </p>

          </div>

        </div>


        {/* ====================================
            Right Side
        ==================================== */}

        <div className="flex items-center gap-3 sm:gap-4">



          <div className="hidden items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 sm:flex">

            <Sparkles
              size={16}
              className="text-blue-600"
            />

            <span className="text-xs font-medium text-slate-600">
              Personal Finance
            </span>

          </div>


          {/* Divider */}

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />


          {/* ==================================
              User
          ================================== */}

          <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-50">


            {/* Avatar */}

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">

              {userInitials}

            </div>


            {/* User Info */}

            <div className="hidden text-left md:block">

              <p className="text-sm font-medium text-slate-900">
                {userName}
              </p>

              <p className="text-xs text-slate-500">
                Personal Account
              </p>

            </div>


          </button>

        </div>

      </div>

    </header>
  );
};


export default Navbar;