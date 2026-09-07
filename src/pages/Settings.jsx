import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  LogOut,
  CheckCircle,
  AlertCircle,
  Pencil,
  KeyRound,
  UserRound,
  ChevronDown,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";


const Settings = () => {

  const navigate = useNavigate();


  // ==========================================
  // User State
  // ==========================================

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);


  // ==========================================
  // Profile State
  // ==========================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [profileLoading, setProfileLoading] =
    useState(false);

  const [profileSuccess, setProfileSuccess] =
    useState("");

  const [profileError, setProfileError] =
    useState("");

  const [showProfileForm, setShowProfileForm] =
    useState(false);


  // ==========================================
  // Password State
  // ==========================================

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [passwordSuccess, setPasswordSuccess] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [showPasswordForm, setShowPasswordForm] =
    useState(false);


  // ==========================================
  // Logout State
  // ==========================================

  const [logoutLoading, setLogoutLoading] =
    useState(false);


  // ==========================================
  // Get Current User
  // ==========================================

  useEffect(() => {

    const fetchCurrentUser = async () => {

      try {

        setLoadingUser(true);

        const response = await api.get("/users/me");

        const currentUser = response.data;

        setUser(currentUser);

        setName(currentUser.name || "");
        setEmail(currentUser.email || "");

      } catch (error) {

        console.error(
          "Failed to load user:",
          error
        );

        if (error.response?.status === 401) {

          localStorage.removeItem(
            "access_token"
          );

          navigate("/login", {
            replace: true,
          });

          return;
        }

      } finally {

        setLoadingUser(false);

      }
    };


    fetchCurrentUser();

  }, [navigate]);


  // ==========================================
  // Open Profile Form
  // ==========================================

  const handleOpenProfile = () => {

    setProfileSuccess("");
    setProfileError("");

    setShowProfileForm(true);

  };


  // ==========================================
  // Close Profile Form
  // ==========================================

  const handleCloseProfile = () => {

    setName(user?.name || "");
    setEmail(user?.email || "");

    setProfileSuccess("");
    setProfileError("");

    setShowProfileForm(false);

  };


  // ==========================================
  // Update Profile
  // ==========================================

  const handleProfileSubmit = async (e) => {

    e.preventDefault();

    setProfileSuccess("");
    setProfileError("");


    if (!name.trim()) {

      setProfileError(
        "Name is required."
      );

      return;
    }


    if (!email.trim()) {

      setProfileError(
        "Email is required."
      );

      return;
    }


    try {

      setProfileLoading(true);

      const response = await api.put(
        "/users/profile",
        {
          name: name.trim(),
          email: email.trim(),
        }
      );


      const updatedUser = response.data;

      setUser(updatedUser);

      setName(updatedUser.name || "");
      setEmail(updatedUser.email || "");


      setProfileSuccess(
        "Your profile information has been updated successfully."
      );


      // Keep the success message visible briefly,
      // then collapse the form.

      setTimeout(() => {

        setShowProfileForm(false);
        setProfileSuccess("");

      }, 1600);


    } catch (error) {

      console.error(
        "Profile update error:",
        error
      );

      setProfileError(
        error.response?.data?.detail ||
        "Failed to update profile."
      );

    } finally {

      setProfileLoading(false);

    }

  };


  // ==========================================
  // Open Password Form
  // ==========================================

  const handleOpenPassword = () => {

    setPasswordSuccess("");
    setPasswordError("");

    setShowPasswordForm(true);

  };


  // ==========================================
  // Close Password Form
  // ==========================================

  const handleClosePassword = () => {

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordSuccess("");
    setPasswordError("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setShowPasswordForm(false);

  };


  // ==========================================
  // Change Password
  // ==========================================

  const handlePasswordSubmit = async (e) => {

    e.preventDefault();

    setPasswordSuccess("");
    setPasswordError("");


    if (!currentPassword) {

      setPasswordError(
        "Current password is required."
      );

      return;
    }


    if (!newPassword) {

      setPasswordError(
        "New password is required."
      );

      return;
    }


    if (!confirmPassword) {

      setPasswordError(
        "Please confirm your new password."
      );

      return;
    }


    if (newPassword.length < 6) {

      setPasswordError(
        "New password must be at least 6 characters."
      );

      return;
    }


    if (newPassword !== confirmPassword) {

      setPasswordError(
        "New passwords do not match."
      );

      return;
    }


    try {

      setPasswordLoading(true);

      const response = await api.put(
        "/users/password",
        {
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }
      );


      setPasswordSuccess(
        response.data?.message ||
        "Password changed successfully."
      );


      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);


      setTimeout(() => {

        setShowPasswordForm(false);
        setPasswordSuccess("");

      }, 1600);


    } catch (error) {

      console.error(
        "Password change error:",
        error
      );

      setPasswordError(
        error.response?.data?.detail ||
        "Failed to change password."
      );

    } finally {

      setPasswordLoading(false);

    }

  };


  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = async () => {

    try {

      setLogoutLoading(true);

      await api.post("/users/logout");

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

    } finally {

      localStorage.removeItem(
        "access_token"
      );

      navigate("/login", {
        replace: true,
      });

    }

  };


  // ==========================================
  // Loading
  // ==========================================

  if (loadingUser) {

    return (
      <main className="p-4 sm:p-6 lg:p-8">

        <div className="mx-auto max-w-4xl">

          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">

              <User
                size={20}
                className="text-blue-600"
              />

            </div>

            <p className="text-sm text-slate-500">
              Loading settings...
            </p>

          </div>

        </div>

      </main>
    );

  }


  // ==========================================
  // JSX
  // ==========================================

  return (
    <main className="p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-4xl">


        {/* ======================================
            Page Header
        ====================================== */}

        <div className="mb-7">

          <h1 className="text-2xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your profile, security, and account preferences.
          </p>

        </div>


        {/* ======================================
            Account Overview
        ====================================== */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-center gap-4">

              {/* Avatar */}

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-600">

                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}

              </div>


              {/* User Info */}

              <div className="min-w-0">

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Account
                </p>

                <h2 className="mt-0.5 truncate text-lg font-semibold text-slate-900">
                  {user?.name || "User"}
                </h2>

                <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-slate-500">

                  <Mail size={14} />

                  {user?.email || "No email available"}

                </p>

              </div>

            </div>


            {/* Status */}

            <div className="flex items-center gap-2 self-start rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 sm:self-center">

              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

              Account Active

            </div>

          </div>

        </section>


        {/* ======================================
            Profile Section
        ====================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Profile Header */}

          <div className="flex flex-col gap-4 px-5 py-5 sm:px-6">

            <div className="flex items-center justify-between gap-4">

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                  <UserRound size={20} />

                </div>

                <div className="min-w-0">

                  <h2 className="font-semibold text-slate-900">
                    Profile Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Keep your personal information up to date.
                  </p>

                </div>

              </div>


              {!showProfileForm && (

                <button
                  type="button"
                  onClick={handleOpenProfile}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >

                  <Pencil size={16} />

                  <span className="hidden sm:inline">
                    Update Information
                  </span>

                  <span className="sm:hidden">
                    Update
                  </span>

                </button>

              )}

            </div>


            {/* Compact Profile Preview */}

            {!showProfileForm && (

              <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 px-4 py-3">

                  <p className="text-xs font-medium text-slate-400">
                    Full Name
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-slate-800">
                    {user?.name || "Not available"}
                  </p>

                </div>


                <div className="rounded-xl bg-slate-50 px-4 py-3">

                  <p className="text-xs font-medium text-slate-400">
                    Email Address
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-slate-800">
                    {user?.email || "Not available"}
                  </p>

                </div>

              </div>

            )}

          </div>


          {/* ====================================
              Profile Form
          ==================================== */}

          {showProfileForm && (

            <div className="border-t border-slate-100 bg-slate-50/50">

              <form
                onSubmit={handleProfileSubmit}
                className="p-5 sm:p-6"
              >

                {/* Form Header */}

                <div className="mb-5 flex items-center justify-between">

                  <div>

                    <h3 className="text-sm font-semibold text-slate-800">
                      Update Information
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Change your name or email address.
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={handleCloseProfile}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-600"
                    aria-label="Close profile form"
                  >

                    <X size={18} />

                  </button>

                </div>


                {/* Success */}

                {profileSuccess && (

                  <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

                    <CheckCircle size={17} />

                    <span>
                      {profileSuccess}
                    </span>

                  </div>

                )}


                {/* Error */}

                {profileError && (

                  <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                    <AlertCircle size={17} />

                    <span>
                      {profileError}
                    </span>

                  </div>

                )}


                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">


                  {/* Name */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>

                    <div className="relative">

                      <User
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        placeholder="Enter your name"
                        autoComplete="name"
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                  </div>


                  {/* Email */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>

                    <div className="relative">

                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                  </div>

                </div>


                {/* Actions */}

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={handleCloseProfile}
                    disabled={profileLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    Cancel

                  </button>


                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <Save size={17} />

                    {profileLoading
                      ? "Saving..."
                      : "Save Changes"}

                  </button>

                </div>

              </form>

            </div>

          )}

        </section>


        {/* ======================================
            Security Section
        ====================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Security Header */}

          <div className="px-5 py-5 sm:px-6">

            <div className="flex items-center justify-between gap-4">

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                  <ShieldCheck size={20} />

                </div>

                <div className="min-w-0">

                  <h2 className="font-semibold text-slate-900">
                    Security
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Manage your password and account security.
                  </p>

                </div>

              </div>


              {!showPasswordForm && (

                <button
                  type="button"
                  onClick={handleOpenPassword}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >

                  <KeyRound size={16} />

                  <span className="hidden sm:inline">
                    Change Password
                  </span>

                  <span className="sm:hidden">
                    Password
                  </span>

                </button>

              )}

            </div>


            {/* Security Summary */}

            {!showPasswordForm && (

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">

                    <Lock size={17} />

                  </div>

                  <div>

                    <p className="text-xs font-medium text-slate-400">
                      Password
                    </p>

                    <p className="mt-0.5 text-sm font-medium text-slate-700">
                      Protected
                    </p>

                  </div>

                </div>


                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-green-500 shadow-sm">

                    <ShieldCheck size={17} />

                  </div>

                  <div>

                    <p className="text-xs font-medium text-slate-400">
                      Security Status
                    </p>

                    <p className="mt-0.5 text-sm font-medium text-green-600">
                      Account Secure
                    </p>

                  </div>

                </div>

              </div>

            )}

          </div>


          {/* ====================================
              Password Form
          ==================================== */}

          {showPasswordForm && (

            <div className="border-t border-slate-100 bg-slate-50/50">

              <form
                onSubmit={handlePasswordSubmit}
                className="p-5 sm:p-6"
              >

                {/* Form Header */}

                <div className="mb-5 flex items-center justify-between">

                  <div>

                    <h3 className="text-sm font-semibold text-slate-800">
                      Change Password
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Choose a strong password with at least 6 characters.
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={handleClosePassword}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-600"
                    aria-label="Close password form"
                  >

                    <X size={18} />

                  </button>

                </div>


                {/* Success */}

                {passwordSuccess && (

                  <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

                    <CheckCircle size={17} />

                    <span>
                      {passwordSuccess}
                    </span>

                  </div>

                )}


                {/* Error */}

                {passwordError && (

                  <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                    <AlertCircle size={17} />

                    <span>
                      {passwordError}
                    </span>

                  </div>

                )}


                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">


                  {/* Current Password */}

                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Current Password
                    </label>

                    <div className="relative">

                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type={
                          showCurrentPassword
                            ? "text"
                            : "password"
                        }
                        value={currentPassword}
                        onChange={(e) =>
                          setCurrentPassword(
                            e.target.value
                          )
                        }
                        placeholder="Enter your current password"
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(
                            (prev) => !prev
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                        aria-label={
                          showCurrentPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >

                        {showCurrentPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}

                      </button>

                    </div>

                  </div>


                  {/* New Password */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      New Password
                    </label>

                    <div className="relative">

                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(
                            e.target.value
                          )
                        }
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            (prev) => !prev
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                        aria-label={
                          showNewPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >

                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}

                      </button>

                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      Minimum 6 characters.
                    </p>

                  </div>


                  {/* Confirm Password */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Confirm New Password
                    </label>

                    <div className="relative">

                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
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
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (prev) => !prev
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
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

                  </div>

                </div>


                {/* Actions */}

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={handleClosePassword}
                    disabled={passwordLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    Cancel

                  </button>


                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <Lock size={17} />

                    {passwordLoading
                      ? "Changing..."
                      : "Change Password"}

                  </button>

                </div>

              </form>

            </div>

          )}

        </section>


        {/* ======================================
            Account Section
        ====================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Header */}

          <div className="flex items-center gap-3 px-5 py-5 sm:px-6">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">

              <LogOut size={20} />

            </div>


            <div>

              <h2 className="font-semibold text-slate-900">
                Account
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Manage your current session.
              </p>

            </div>

          </div>


          {/* Logout Area */}

          <div className="border-t border-slate-100 bg-slate-50/40">

            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

              <div className="flex items-start gap-3">

                <div className="mt-0.5 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm sm:flex">

                  <User size={16} />

                </div>

                <div>

                  <p className="text-sm font-medium text-slate-700">
                    Sign out of your account
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    You can sign in again anytime using your credentials.
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >

                <LogOut size={17} />

                {logoutLoading
                  ? "Signing out..."
                  : "Logout"}

              </button>

            </div>

          </div>

        </section>


        {/* ======================================
            Bottom Security Note
        ====================================== */}

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3.5">

          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>

            <p className="text-xs font-semibold text-blue-800">
              Keep your account secure
            </p>

            <p className="mt-0.5 text-xs leading-5 text-blue-700/70">
              Never share your password with anyone. Use a strong,
              unique password for your Expense Tracker account.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
};


export default Settings;