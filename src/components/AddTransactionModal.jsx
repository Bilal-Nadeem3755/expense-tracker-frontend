import { useEffect, useState } from "react";

import {
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  WalletCards,
} from "lucide-react";

import AnimatedDropdown from "./AnimatedDropdown";

import { createTransaction } from "../services/transactionService";


// ==========================================
// Component
// ==========================================

const AddTransactionModal = ({
  isOpen,
  onClose,
  categories = [],
  onTransactionAdded,
}) => {

  // ==========================================
  // State
  // ==========================================

  const [type, setType] = useState("expense");

  const [amount, setAmount] = useState("");

  const [description, setDescription] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ==========================================
  // Reset Form
  // ==========================================

  const resetForm = () => {
    setType("expense");
    setAmount("");
    setDescription("");
    setCategoryId("");
    setError("");
  };


  // ==========================================
  // Close Modal
  // ==========================================

  const handleClose = () => {
    if (loading) {
      return;
    }

    resetForm();
    onClose();
  };


  // ==========================================
  // Reset Error When Modal Opens
  // ==========================================

  useEffect(() => {
    if (isOpen) {
      setError("");
    }
  }, [isOpen]);


  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");


    // ------------------------------------------
    // Validation
    // ------------------------------------------

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }


    try {
      setLoading(true);


      const transactionData = {
        amount: Number(amount),
        type,
        description: description.trim() || null,
        category_id: Number(categoryId),
      };


      const newTransaction =
        await createTransaction(transactionData);


      // ------------------------------------------
      // Notify Parent
      // ------------------------------------------

      if (onTransactionAdded) {
        onTransactionAdded(newTransaction);
      }


      // ------------------------------------------
      // Reset & Close
      // ------------------------------------------

      resetForm();

      onClose();

    } catch (error) {
      console.error(
        "Failed to create transaction:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Failed to create transaction. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // Dropdown Options
  // ==========================================

  const typeOptions = [
    {
      value: "expense",
      label: "Expense",
    },
    {
      value: "income",
      label: "Income",
    },
  ];


  const categoryOptions = categories.map(
    (category) => ({
      value: String(category.id),
      label: category.name,
    })
  );


  // ==========================================
  // Don't Render
  // ==========================================

  if (!isOpen) {
    return null;
  }


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">

      {/* ====================================== */}
      {/* Overlay */}
      {/* ====================================== */}

      <div
        onClick={handleClose}
        className="
          absolute inset-0
          bg-slate-950/50
          backdrop-blur-sm
          animate-[fadeIn_0.2s_ease-out]
        "
      />


      {/* ====================================== */}
      {/* Modal */}
      {/* ====================================== */}

      <div
        className="
          relative
          w-full
          max-w-lg
          overflow-visible
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-2xl
          animate-[modalIn_0.25s_ease-out]
        "
      >

        {/* ====================================== */}
        {/* Header */}
        {/* ====================================== */}

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <WalletCards size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Add Transaction
              </h2>

              <p className="text-xs text-slate-500">
                Record your income or expense
              </p>
            </div>

          </div>


          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="
              rounded-lg
              p-2
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X size={20} />
          </button>

        </div>


        {/* ====================================== */}
        {/* Form */}
        {/* ====================================== */}

        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6"
        >

          {/* ====================================== */}
          {/* Error */}
          {/* ====================================== */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}


          {/* ====================================== */}
          {/* Transaction Type */}
          {/* ====================================== */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Transaction Type
            </label>


            <div className="grid grid-cols-2 gap-3">

              {/* Expense */}

              <button
                type="button"
                onClick={() => setType("expense")}
                disabled={loading}
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  px-4
                  py-3
                  text-left
                  transition-all
                  duration-200
                  disabled:cursor-not-allowed
                  ${
                    type === "expense"
                      ? "border-red-200 bg-red-50 text-red-600 shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }
                `}
              >

                <div
                  className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    ${
                      type === "expense"
                        ? "bg-red-100"
                        : "bg-slate-100"
                    }
                  `}
                >
                  <ArrowUpRight size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Expense
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Money spent
                  </p>
                </div>

              </button>


              {/* Income */}

              <button
                type="button"
                onClick={() => setType("income")}
                disabled={loading}
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  px-4
                  py-3
                  text-left
                  transition-all
                  duration-200
                  disabled:cursor-not-allowed
                  ${
                    type === "income"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }
                `}
              >

                <div
                  className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    ${
                      type === "income"
                        ? "bg-emerald-100"
                        : "bg-slate-100"
                    }
                  `}
                >
                  <ArrowDownLeft size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Income
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Money received
                  </p>
                </div>

              </button>

            </div>

          </div>


          {/* ====================================== */}
          {/* Amount */}
          {/* ====================================== */}

          <div className="mt-5">

            <label
              htmlFor="amount"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Amount
            </label>


            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                $
              </span>


              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="0.00"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  py-3
                  pl-9
                  pr-4
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-300
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                  disabled:cursor-not-allowed
                  disabled:bg-slate-50
                "
              />

            </div>

          </div>


          {/* ====================================== */}
          {/* Category */}
          {/* ====================================== */}

          <div className="mt-5">

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Category
            </label>


            {categoryOptions.length > 0 ? (

              <AnimatedDropdown
                value={categoryId}
                onChange={setCategoryId}
                options={categoryOptions}
                placeholder="Select category"
              />

            ) : (

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">

                <p className="text-sm font-medium text-amber-700">
                  No categories available
                </p>

                <p className="mt-1 text-xs text-amber-600">
                  Please create a category first.
                </p>

              </div>

            )}

          </div>


          {/* ====================================== */}
          {/* Description */}
          {/* ====================================== */}

          <div className="mt-5">

            <label
              htmlFor="description"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Description
            </label>


            <textarea
              id="description"
              rows="3"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="e.g. Grocery shopping"
              disabled={loading}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-300
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            />

          </div>


          {/* ====================================== */}
          {/* Buttons */}
          {/* ====================================== */}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="
                rounded-xl
                border
                border-slate-200
                px-5
                py-2.5
                text-sm
                font-medium
                text-slate-600
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                loading ||
                categories.length === 0
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Adding...
                </>
              ) : (
                "Add Transaction"
              )}

            </button>

          </div>

        </form>

      </div>


      {/* ====================================== */}
      {/* Animations */}
      {/* ====================================== */}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes modalIn {
            from {
              opacity: 0;
              transform: scale(0.96) translateY(8px);
            }

            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
};


export default AddTransactionModal;