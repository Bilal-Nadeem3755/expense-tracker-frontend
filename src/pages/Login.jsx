import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  WalletCards,
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  // ==========================================
  // State
  // ==========================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Login
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      // ========================================
      // Login Form Data
      // ========================================

      const formData = new URLSearchParams();

      formData.append("username", email.trim());
      formData.append("password", password);

      // ========================================
      // Login Request
      // ========================================

      const response = await api.post(
        "/users/login",
        formData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      // ========================================
      // Save New User JWT
      // ========================================

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      // ========================================
      // Tell App That Auth Has Changed
      // ========================================

      window.dispatchEvent(
        new Event("auth-changed")
      );

      // ========================================
      // Go To Dashboard
      // ========================================

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.detail ||
          "Invalid email or password."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="flex min-h-screen">

        {/* ====================================
            Left Branding Panel
        ==================================== */}

        <div className="relative hidden w-[42%] overflow-hidden bg-slate-950 lg:flex">

          {/* Background Glow */}

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          {/* Content */}

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

            {/* Logo */}

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">

                <WalletCards size={23} />

              </div>

              <div>

                <p className="text-base font-bold text-white">
                  Expense Tracker
                </p>

                <p className="text-xs text-slate-400">
                  Personal Finance
                </p>

              </div>

            </div>


            {/* Main Content */}

            <div className="max-w-md">

              {/* Badge */}

              <div className="mb-5 mt-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">

                <ShieldCheck size={14} />

                Secure personal finance management

              </div>


              {/* Heading */}

              <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">

                Welcome back.

                <span className="block text-blue-500">
                  Your finances await.
                </span>

              </h2>


              {/* Description */}

              <p className="mt-5 text-sm leading-6 text-slate-400">

                Sign in to keep track of your income,
                expenses, transactions, and financial
                activity — all from one simple dashboard.

              </p>


              {/* Features */}

              <div className="mt-8 space-y-4">

                {/* Feature 1 */}

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-blue-400">

                    <CheckCircle size={18} />

                  </div>

                  <div>

                    <p className="text-sm font-medium text-slate-200">
                      Track your transactions
                    </p>

                    <p className="text-xs text-slate-500">
                      Keep your financial activity organized.
                    </p>

                  </div>

                </div>


                {/* Feature 2 */}

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-blue-400">

                    <TrendingUp size={18} />

                  </div>

                  <div>

                    <p className="text-sm font-medium text-slate-200">
                      Monitor your spending
                    </p>

                    <p className="text-xs text-slate-500">
                      Understand where your money goes.
                    </p>

                  </div>

                </div>


                {/* Feature 3 */}

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-blue-400">

                    <ShieldCheck size={18} />

                  </div>

                  <div>

                    <p className="text-sm font-medium text-slate-200">
                      Secure account access
                    </p>

                    <p className="text-xs text-slate-500">
                      Your account is protected with authentication.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Footer */}

            <p className="text-xs text-slate-600 mt-5">
              © {new Date().getFullYear()} Expense Tracker
            </p>

          </div>

        </div>


        {/* ====================================
            Right Login Section
        ==================================== */}

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">

          <div className="w-full max-w-md">


            {/* =================================
                Mobile Logo
            ================================= */}

            <div className="mb-7 text-center lg:hidden">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">

                <WalletCards size={24} />

              </div>

              <p className="mt-3 text-base font-bold text-slate-900">
                Expense Tracker
              </p>

            </div>


            {/* =================================
                Heading
            ================================= */}

            <div className="mb-7">

              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back
              </h1>

              <p className="mt-1.5 text-sm text-slate-500">
                Sign in to manage your finances.
              </p>

            </div>


            {/* =================================
                Login Card
            ================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* =================================
                    Error
                ================================= */}

                {error && (

                  <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                    <AlertCircle
                      size={17}
                      className="mt-0.5 shrink-0"
                    />

                    <span>
                      {error}
                    </span>

                  </div>

                )}


                {/* =================================
                    Email
                ================================= */}

                <div>

                  <label
                    htmlFor="login-email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={loading}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                  </div>

                </div>


                {/* =================================
                    Password
                ================================= */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="login-password"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>

                  </div>


                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="login-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />


                    {/* Show / Hide Password */}

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >

                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>

                </div>


                {/* =================================
                    Submit Button
                ================================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-600/10 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (

                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Signing in...
                    </>

                  ) : (

                    <>
                      Sign In

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>

                  )}

                </button>

              </form>


              {/* =================================
                  Register
              ================================= */}

              <div className="mt-6 border-t border-slate-100 pt-5">

                <p className="text-center text-sm text-slate-500">

                  Don't have an account?{" "}

                  <Link
                    to="/register"
                    className="font-medium text-blue-600 transition hover:text-blue-700"
                  >
                    Create one
                  </Link>

                </p>

              </div>

            </div>


            {/* =================================
                Security Note
            ================================= */}

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">

              <ShieldCheck size={14} />

              <span>
                Your account information is securely protected.
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;