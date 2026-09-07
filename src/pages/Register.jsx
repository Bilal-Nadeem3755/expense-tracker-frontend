import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  WalletCards,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  // ==========================================
  // State
  // ==========================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Register
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/users/", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Registration successful

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Password Match
  // ==========================================

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const passwordsDoNotMatch =
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="flex min-h-screen">

        {/* ======================================
            Left Branding Panel
        ====================================== */}

        <div className="relative hidden w-[42%] overflow-hidden bg-slate-950 lg:flex">

          {/* Decorative background */}

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />


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

                <TrendingUp size={14} />

                Take control of your finances

              </div>


              {/* Heading */}

              <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">

                Manage your money.

                <span className="block text-blue-500">
                  Build better habits.
                </span>

              </h2>


              {/* Description */}

              <p className="mt-5 text-sm leading-6 text-slate-400">

                Track your income and expenses, organize
                transactions, and get a clear picture of
                your financial activity — all in one place.

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
                      Track every transaction
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
                      Understand your spending
                    </p>

                    <p className="text-xs text-slate-500">
                      See where your money is going.
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
                      Keep your account secure
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


        {/* ======================================
            Right Register Area
        ====================================== */}

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-7 text-center lg:hidden">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">

                <WalletCards size={24} />

              </div>

              <p className="mt-3 text-base font-bold text-slate-900">
                Expense Tracker
              </p>

            </div>


            {/* Header */}

            <div className="mb-7">

              <h1 className="text-2xl font-bold text-slate-900">
                Create your account
              </h1>

              <p className="mt-1.5 text-sm text-slate-500">
                Start managing your finances in one place.
              </p>

            </div>


            {/* Register Card */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Error */}

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


                {/* Full Name */}

                <div>

                  <label
                    htmlFor="register-name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="register-name"
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="John Doe"
                      autoComplete="name"
                      disabled={loading}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                  </div>

                </div>


                {/* Email */}

                <div>

                  <label
                    htmlFor="register-email"
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
                      id="register-email"
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


                {/* Password */}

                <div>

                  <label
                    htmlFor="register-password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="register-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Create a password"
                      autoComplete="new-password"
                      disabled={loading}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

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


                  {/* Password Hint */}

                  <div className="mt-2 flex items-center gap-1.5">

                    <CheckCircle
                      size={13}
                      className={
                        password.length >= 6
                          ? "text-green-500"
                          : "text-slate-300"
                      }
                    />

                    <p
                      className={
                        password.length >= 6
                          ? "text-xs text-green-600"
                          : "text-xs text-slate-400"
                      }
                    >
                      At least 6 characters
                    </p>

                  </div>

                </div>


                {/* Confirm Password */}

                <div>

                  <label
                    htmlFor="register-confirm-password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="register-confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      disabled={loading}
                      className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                        passwordsDoNotMatch
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : passwordsMatch
                          ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                          : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >

                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>


                  {/* Password Match Message */}

                  {passwordsMatch && (

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600">

                      <CheckCircle size={13} />

                      Passwords match

                    </div>

                  )}

                  {passwordsDoNotMatch && (

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-red-500">

                      <AlertCircle size={13} />

                      Passwords do not match

                    </div>

                  )}

                </div>


                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-600/10 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (

                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Creating Account...
                    </>

                  ) : (

                    <>
                      Create Account

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>

                  )}

                </button>

              </form>


              {/* Login */}

              <div className="mt-6 border-t border-slate-100 pt-5">

                <p className="text-center text-sm text-slate-500">

                  Already have an account?{" "}

                  <Link
                    to="/login"
                    className="font-medium text-blue-600 transition hover:text-blue-700"
                  >
                    Sign in
                  </Link>

                </p>

              </div>

            </div>


            {/* Bottom Security Note */}

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

export default Register;