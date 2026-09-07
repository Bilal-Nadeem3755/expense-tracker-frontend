import { useEffect, useState } from "react";

import {
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  RefreshCw,
  AlertCircle,
  Receipt,
  X,
  AlertTriangle,
} from "lucide-react";

import AnimatedDropdown from "../components/AnimatedDropdown";
import AddTransactionModal from "../components/AddTransactionModal";

import {
  getTransactions,
  deleteTransaction,
} from "../services/transactionService";

import { getCategories } from "../services/categoryService";

const Transactions = () => {
  // ==========================================
  // State
  // ==========================================

  const [transactions, setTransactions] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [typeFilter, setTypeFilter] = useState("all");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);

  // Delete confirmation state
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // Fetch Data
  // ==========================================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [transactionsData, categoriesData] = await Promise.all([
        getTransactions(),
        getCategories(),
      ]);

      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);

      setError(error.response?.data?.detail || "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // Add Transaction
  // ==========================================

  const handleTransactionAdded = (newTransaction) => {
    setTransactions((previousTransactions) => [
      newTransaction,
      ...previousTransactions,
    ]);
  };

  // ==========================================
  // Open Delete Confirmation
  // ==========================================

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
  };

  // ==========================================
  // Close Delete Confirmation
  // ==========================================

  const handleCloseDeleteModal = () => {
    if (deleting) {
      return;
    }

    setTransactionToDelete(null);
  };

  // ==========================================
  // Confirm Delete
  // ==========================================

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) {
      return;
    }

    try {
      setDeleting(true);

      await deleteTransaction(transactionToDelete.id);

      setTransactions((previousTransactions) =>
        previousTransactions.filter(
          (transaction) => transaction.id !== transactionToDelete.id,
        ),
      );

      setTransactionToDelete(null);
    } catch (error) {
      console.error("Failed to delete transaction:", error);

      setError(
        error.response?.data?.detail || "Failed to delete transaction.",
      );

      setTransactionToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // Get Category Name
  // ==========================================

  const getCategoryName = (categoryId) => {
    const category = categories.find((item) => item.id === categoryId);

    return category?.name || "Unknown";
  };

  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // ==========================================
  // Format Amount
  // ==========================================

  const formatAmount = (amount) => {
    return Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // ==========================================
  // Filter Transactions
  // ==========================================

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType =
      typeFilter === "all" || transaction.type === typeFilter;

    const matchesCategory =
      categoryFilter === "all" ||
      transaction.category_id === Number(categoryFilter);

    return matchesType && matchesCategory;
  });

  // ==========================================
  // Summary
  // ==========================================

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  // ==========================================
  // Dropdown Options
  // ==========================================

  const typeOptions = [
    {
      value: "all",
      label: "All Types",
    },
    {
      value: "income",
      label: "Income",
    },
    {
      value: "expense",
      label: "Expense",
    },
  ];

  const categoryOptions = [
    {
      value: "all",
      label: "All Categories",
    },

    ...categories.map((category) => ({
      value: String(category.id),
      label: category.name,
    })),
  ];

  // ==========================================
  // Loading State
  // ==========================================

  if (loading) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your income and expenses.
          </p>
        </div>

        <div
          className="
            flex
            min-h-100
            items-center
            justify-center
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <div className="text-center">
            <RefreshCw
              size={32}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 text-sm font-medium text-slate-700">
              Loading transactions...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait a moment.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // Error State
  // ==========================================

  if (error && transactions.length === 0) {
    return (
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your income and expenses.
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-white
            p-8
            text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-red-100
            "
          >
            <AlertCircle size={24} className="text-red-600" />
          </div>

          <h2 className="mt-4 font-semibold text-slate-900">
            Failed to load transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500">{error}</p>

          <button
            onClick={fetchData}
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
            "
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // Main UI
  // ==========================================

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      {/* ====================================== */}
      {/* Header */}
      {/* ====================================== */}

      <div
        className="
          mb-6
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Transactions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your income and expenses.
          </p>
        </div>

        {transactions.length > 0 && categories.length > 0 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2
            "
          >
            <Plus size={18} />
            Add Transaction
          </button>
        )}
      </div>

      {/* ====================================== */}
      {/* Delete Error Banner */}
      {/* ====================================== */}

      {error && transactions.length > 0 && (
        <div
          className="
            mb-6
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
          "
        >
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div className="min-w-0">
            <p className="text-sm font-medium text-red-800">
              Something went wrong
            </p>

            <p className="mt-1 text-xs text-red-600">{error}</p>
          </div>

          <button
            onClick={() => setError("")}
            className="
              ml-auto
              shrink-0
              rounded-md
              p-1
              text-red-400
              transition
              hover:bg-red-100
              hover:text-red-600
            "
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* ====================================== */}
      {/* Summary */}
      {/* ====================================== */}

      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-3
        "
      >
        {/* Total */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <p className="text-sm text-slate-500">Total Transactions</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {transactions.length}
          </p>
        </div>

        {/* Income */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <p className="text-sm text-slate-500">Total Income</p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            ${formatAmount(totalIncome)}
          </p>
        </div>

        {/* Expense */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >
          <p className="text-sm text-slate-500">Total Expenses</p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            ${formatAmount(totalExpenses)}
          </p>
        </div>
      </div>

      {/* ====================================== */}
      {/* Filters */}
      {/* ====================================== */}

      <div
        className="
          mb-6
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          sm:p-5
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
          "
        >
          {/* Type */}

          <div>
            <label
              className="
                mb-2
                block
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Transaction Type
            </label>

            <AnimatedDropdown
              value={typeFilter}
              onChange={setTypeFilter}
              options={typeOptions}
              placeholder="Select type"
            />
          </div>

          {/* Category */}

          <div>
            <label
              className="
                mb-2
                block
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Category
            </label>

            <AnimatedDropdown
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
              placeholder="Select category"
            />
          </div>
        </div>
      </div>

      {/* ====================================== */}
      {/* Transactions */}
      {/* ====================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        {/* Header */}

        <div
          className="
            border-b
            border-slate-100
            p-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-blue-100
                text-blue-600
              "
            >
              <Receipt size={18} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                All Transactions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your complete financial activity
              </p>
            </div>
          </div>
        </div>

        {/* ====================================== */}
        {/* Empty State */}
        {/* ====================================== */}

        {filteredTransactions.length === 0 ? (
          <div
            className="
              px-5
              py-16
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-slate-100
              "
            >
              <ArrowUpRight size={22} className="text-slate-400" />
            </div>

            <h3
              className="
                mt-4
                text-sm
                font-semibold
                text-slate-900
              "
            >
              No transactions found
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              Try changing your filters or add a new transaction.
            </p>

            <button
              onClick={() => setShowAddModal(true)}
              className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
              "
            >
              <Plus size={17} />
              Add Transaction
            </button>
          </div>
        ) : (
          <>
            {/* ====================================== */}
            {/* Desktop Table */}
            {/* ====================================== */}

            <div
              className="
                hidden
                overflow-x-auto
                md:block
              "
            >
              <table className="w-full">
                <thead>
                  <tr
                    className="
                      border-b
                      border-slate-100
                      bg-slate-50
                    "
                  >
                    <th
                      className="
                        px-5
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Transaction
                    </th>

                    <th
                      className="
                        px-5
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Category
                    </th>

                    <th
                      className="
                        px-5
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Date
                    </th>

                    <th
                      className="
                        px-5
                        py-4
                        text-right
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Amount
                    </th>

                    <th
                      className="
                        px-5
                        py-4
                        text-right
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody
                  className="
                    divide-y
                    divide-slate-100
                  "
                >
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="
                        transition
                        hover:bg-slate-50
                      "
                    >
                      {/* Transaction */}

                      <td className="px-5 py-4">
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >
                          <div
                            className={`
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              ${
                                transaction.type === "income"
                                  ? "bg-emerald-100"
                                  : "bg-red-100"
                              }
                            `}
                          >
                            {transaction.type === "income" ? (
                              <ArrowDownLeft
                                size={18}
                                className="text-emerald-600"
                              />
                            ) : (
                              <ArrowUpRight
                                size={18}
                                className="text-red-600"
                              />
                            )}
                          </div>

                          <div>
                            <p
                              className="
                                max-w-62.5
                                truncate
                                text-sm
                                font-medium
                                text-slate-900
                              "
                            >
                              {transaction.description ||
                                "Untitled Transaction"}
                            </p>

                            <p
                              className="
                                text-xs
                                text-slate-400
                              "
                            >
                              {transaction.type === "income"
                                ? "Income"
                                : "Expense"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}

                      <td
                        className="
                          px-5
                          py-4
                          text-sm
                          text-slate-600
                        "
                      >
                        {getCategoryName(transaction.category_id)}
                      </td>

                      {/* Date */}

                      <td
                        className="
                          px-5
                          py-4
                          text-sm
                          text-slate-500
                        "
                      >
                        {formatDate(transaction.created_at)}
                      </td>

                      {/* Amount */}

                      <td
                        className="
                          px-5
                          py-4
                          text-right
                        "
                      >
                        <span
                          className={`
                            text-sm
                            font-semibold
                            ${
                              transaction.type === "income"
                                ? "text-emerald-600"
                                : "text-red-600"
                            }
                          `}
                        >
                          {transaction.type === "income" ? "+" : "-"}$
                          {formatAmount(transaction.amount)}
                        </span>
                      </td>

                      {/* Delete */}

                      <td
                        className="
                          px-5
                          py-4
                          text-right
                        "
                      >
                        <button
                          onClick={() => handleDeleteClick(transaction)}
                          className="
                            rounded-lg
                            p-2
                            text-slate-400
                            transition
                            hover:bg-red-50
                            hover:text-red-600
                            focus:outline-none
                            focus:ring-2
                            focus:ring-red-500
                            focus:ring-offset-1
                          "
                          title="Delete transaction"
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ====================================== */}
            {/* Mobile Cards */}
            {/* ====================================== */}

            <div
              className="
                divide-y
                divide-slate-100
                md:hidden
              "
            >
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4">
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                      "
                    >
                      <div
                        className={`
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          ${
                            transaction.type === "income"
                              ? "bg-emerald-100"
                              : "bg-red-100"
                          }
                        `}
                      >
                        {transaction.type === "income" ? (
                          <ArrowDownLeft
                            size={18}
                            className="text-emerald-600"
                          />
                        ) : (
                          <ArrowUpRight
                            size={18}
                            className="text-red-600"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            text-sm
                            font-medium
                            text-slate-900
                          "
                        >
                          {transaction.description ||
                            "Untitled Transaction"}
                        </p>

                        <p
                          className="
                            text-xs
                            text-slate-400
                          "
                        >
                          {getCategoryName(transaction.category_id)}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`
                        shrink-0
                        text-sm
                        font-semibold
                        ${
                          transaction.type === "income"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }
                      `}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {formatAmount(transaction.amount)}
                    </p>
                  </div>

                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      {formatDate(transaction.created_at)}
                    </p>

                    <button
                      onClick={() => handleDeleteClick(transaction)}
                      className="
                        rounded-lg
                        p-2
                        text-slate-400
                        transition
                        hover:bg-red-50
                        hover:text-red-600
                        focus:outline-none
                        focus:ring-2
                        focus:ring-red-500
                      "
                      title="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ====================================== */}
      {/* Add Transaction Modal */}
      {/* ====================================== */}

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
        onTransactionAdded={handleTransactionAdded}
      />

      {/* ====================================== */}
      {/* Delete Confirmation Modal */}
      {/* ====================================== */}

      {transactionToDelete && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-900/40
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              handleCloseDeleteModal();
            }
          }}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-2xl
            "
          >
            {/* Modal Header */}

            <div className="flex items-start justify-between gap-4">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-red-100
                "
              >
                <AlertTriangle
                  size={21}
                  className="text-red-600"
                />
              </div>

              <button
                onClick={handleCloseDeleteModal}
                disabled={deleting}
                className="
                  rounded-lg
                  p-1.5
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal Content */}

            <div className="mt-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Delete transaction?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete this transaction? This
                action cannot be undone.
              </p>

              {/* Transaction Preview */}

              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-3.5
                "
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {transactionToDelete.description ||
                        "Untitled Transaction"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {getCategoryName(transactionToDelete.category_id)}
                      {" · "}
                      {transactionToDelete.type === "income"
                        ? "Income"
                        : "Expense"}
                    </p>
                  </div>

                  <p
                    className={`
                      shrink-0
                      text-sm
                      font-semibold
                      ${
                        transactionToDelete.type === "income"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }
                    `}
                  >
                    {transactionToDelete.type === "income" ? "+" : "-"}$
                    {formatAmount(transactionToDelete.amount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}

            <div
              className="
                mt-6
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                onClick={handleCloseDeleteModal}
                disabled={deleting}
                className="
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-red-600
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >
                {deleting ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Transaction
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Transactions;