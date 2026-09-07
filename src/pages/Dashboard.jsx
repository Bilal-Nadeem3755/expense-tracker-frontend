import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  AlertCircle,
  Receipt,
} from "lucide-react";

import StatCard from "../components/StatCard";
import AddTransactionModal from "../components/AddTransactionModal";
import AnimatedDropdown from "../components/AnimatedDropdown";

import api from "../services/api";
import { getCategories } from "../services/categoryService";


const Dashboard = () => {

  const navigate = useNavigate();


  // ==========================================
  // State
  // ==========================================

  const [transactions, setTransactions] = useState([]);

  const [categories, setCategories] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [chartPeriod, setChartPeriod] = useState("this-month");

  const [hoveredChartItem, setHoveredChartItem] = useState(null);


  // ==========================================
  // Chart Period Options
  // ==========================================

  const chartPeriodOptions = [
    {
      value: "this-month",
      label: "This Month",
    },
    {
      value: "last-month",
      label: "Last Month",
    },
    {
      value: "last-6-months",
      label: "Last 6 Months",
    },
  ];


  // ==========================================
  // Fetch Dashboard Data
  // ==========================================

  const fetchDashboardData = async () => {

    try {

      setLoading(true);
      setError("");

      const [
        transactionsResponse,
        categoriesData,
      ] = await Promise.all([
        api.get("/transactions/"),
        getCategories(),
      ]);

      setTransactions(
        transactionsResponse.data || []
      );

      setCategories(
        categoriesData || []
      );

    } catch (error) {

      console.error(
        "Failed to load dashboard data:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Failed to load dashboard data."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    fetchDashboardData();
  }, []);


  // ==========================================
  // Handle Transaction Added
  // ==========================================

  const handleTransactionAdded = (
    newTransaction
  ) => {

    setTransactions(
      (previousTransactions) => [
        newTransaction,
        ...previousTransactions,
      ]
    );

  };


  // ==========================================
  // Get Category Name
  // ==========================================

  const getCategoryName = (categoryId) => {

    const category = categories.find(
      (item) => item.id === categoryId
    );

    return category?.name || "Unknown";

  };


  // ==========================================
  // Format Amount
  // ==========================================

  const formatAmount = (amount) => {

    return Number(amount).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  };


  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );

  };


  // ==========================================
  // Current Date
  // ==========================================

  const now = new Date();

  const currentMonth = now.getMonth();

  const currentYear = now.getFullYear();


  // ==========================================
  // All-Time Income
  // ==========================================

  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );


  // ==========================================
  // All-Time Expenses
  // ==========================================

  const totalExpenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );


  // ==========================================
  // Total Balance
  // ==========================================

  const totalBalance =
    totalIncome - totalExpenses;


  // ==========================================
  // This Month Transactions
  // ==========================================

  const thisMonthTransactions =
    transactions.filter((transaction) => {

      if (!transaction.created_at) {
        return false;
      }

      const transactionDate =
        new Date(transaction.created_at);

      return (
        transactionDate.getMonth() ===
          currentMonth &&
        transactionDate.getFullYear() ===
          currentYear
      );

    });


  // ==========================================
  // Monthly Income
  // ==========================================

  const monthlyIncome =
    thisMonthTransactions
      .filter(
        (transaction) =>
          transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );


  // ==========================================
  // Monthly Expenses
  // ==========================================

  const monthlyExpenses =
    thisMonthTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );


  // ==========================================
  // Monthly Net Balance
  // ==========================================

  const monthlyNetBalance =
    monthlyIncome - monthlyExpenses;


  // ==========================================
  // Current Month Name
  // ==========================================

  const currentMonthName =
    now.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );


  // ==========================================
  // Chart Data
  // ==========================================

  const chartData = useMemo(() => {

    const today = new Date();


    // ------------------------------------------
    // This Month
    // ------------------------------------------

    if (chartPeriod === "this-month") {

      const year = today.getFullYear();

      const month = today.getMonth();

      const daysInMonth =
        new Date(
          year,
          month + 1,
          0
        ).getDate();


      return Array.from(
        { length: daysInMonth },
        (_, index) => {

          const day = index + 1;

          let income = 0;

          let expense = 0;


          transactions.forEach(
            (transaction) => {

              if (!transaction.created_at) {
                return;
              }

              const date =
                new Date(
                  transaction.created_at
                );


              if (
                date.getFullYear() !== year ||
                date.getMonth() !== month ||
                date.getDate() !== day
              ) {
                return;
              }


              if (
                transaction.type ===
                "income"
              ) {
                income += Number(
                  transaction.amount
                );
              }


              if (
                transaction.type ===
                "expense"
              ) {
                expense += Number(
                  transaction.amount
                );
              }

            }
          );


          return {

            label: String(day),

            fullLabel:
              `${today.toLocaleDateString(
                "en-US",
                {
                  month: "short",
                }
              )} ${day}`,

            income,

            expense,

          };

        }
      );

    }


    // ------------------------------------------
    // Last Month
    // ------------------------------------------

    if (chartPeriod === "last-month") {

      const date = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );

      const year =
        date.getFullYear();

      const month =
        date.getMonth();

      const daysInMonth =
        new Date(
          year,
          month + 1,
          0
        ).getDate();


      return Array.from(
        { length: daysInMonth },
        (_, index) => {

          const day = index + 1;

          let income = 0;

          let expense = 0;


          transactions.forEach(
            (transaction) => {

              if (!transaction.created_at) {
                return;
              }

              const transactionDate =
                new Date(
                  transaction.created_at
                );


              if (
                transactionDate.getFullYear() !==
                  year ||
                transactionDate.getMonth() !==
                  month ||
                transactionDate.getDate() !==
                  day
              ) {
                return;
              }


              if (
                transaction.type ===
                "income"
              ) {
                income += Number(
                  transaction.amount
                );
              }


              if (
                transaction.type ===
                "expense"
              ) {
                expense += Number(
                  transaction.amount
                );
              }

            }
          );


          return {

            label: String(day),

            fullLabel:
              `${date.toLocaleDateString(
                "en-US",
                {
                  month: "short",
                }
              )} ${day}`,

            income,

            expense,

          };

        }
      );

    }


    // ------------------------------------------
    // Last 6 Months
    // ------------------------------------------

    return Array.from(
      { length: 6 },
      (_, index) => {

        const date = new Date(
          today.getFullYear(),
          today.getMonth() -
            (5 - index),
          1
        );

        const year =
          date.getFullYear();

        const month =
          date.getMonth();

        let income = 0;

        let expense = 0;


        transactions.forEach(
          (transaction) => {

            if (!transaction.created_at) {
              return;
            }

            const transactionDate =
              new Date(
                transaction.created_at
              );


            if (
              transactionDate.getFullYear() !==
                year ||
              transactionDate.getMonth() !==
                month
            ) {
              return;
            }


            if (
              transaction.type ===
              "income"
            ) {
              income += Number(
                transaction.amount
              );
            }


            if (
              transaction.type ===
              "expense"
            ) {
              expense += Number(
                transaction.amount
              );
            }

          }
        );


        return {

          label:
            date.toLocaleDateString(
              "en-US",
              {
                month: "short",
              }
            ),

          fullLabel:
            date.toLocaleDateString(
              "en-US",
              {
                month: "long",
                year: "numeric",
              }
            ),

          income,

          expense,

        };

      }
    );

  }, [
    transactions,
    chartPeriod,
  ]);


  // ==========================================
  // Chart Maximum
  // ==========================================

  const chartMax = useMemo(() => {

    const maximum = Math.max(
      ...chartData.flatMap(
        (item) => [
          item.income,
          item.expense,
        ]
      ),
      0
    );


    if (maximum === 0) {
      return 100;
    }


    return Math.ceil(
      maximum * 1.15
    );

  }, [chartData]);


  // ==========================================
  // Chart Totals
  // ==========================================

  const chartIncomeTotal =
    chartData.reduce(
      (total, item) =>
        total + item.income,
      0
    );


  const chartExpenseTotal =
    chartData.reduce(
      (total, item) =>
        total + item.expense,
      0
    );


  // ==========================================
  // Recent Transactions
  // ==========================================

  const recentTransactions =
    transactions.slice(0, 4);


  // ==========================================
  // Loading State
  // ==========================================

  if (loading) {

    return (

      <main className="p-4 sm:p-6 lg:p-8">

        <div className="mb-6">

          <h1 className="text-2xl font-bold text-slate-900">
            Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your finances.
          </p>

        </div>


        <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="text-center">

            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 text-sm font-medium text-slate-700">
              Loading dashboard...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Fetching your financial data.
            </p>

          </div>

        </div>

      </main>

    );

  }


  // ==========================================
  // Error State
  // ==========================================

  if (error) {

    return (

      <main className="p-4 sm:p-6 lg:p-8">

        <div className="mb-6">

          <h1 className="text-2xl font-bold text-slate-900">
            Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your finances.
          </p>

        </div>


        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle
              size={24}
              className="text-red-600"
            />
          </div>


          <h2 className="mt-4 font-semibold text-slate-900">
            Failed to load dashboard
          </h2>


          <p className="mt-1 text-sm text-slate-500">
            {error}
          </p>


          <button
            onClick={fetchDashboardData}
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
              shadow-sm
              transition
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-200
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
  // Dashboard
  // ==========================================

  return (

    <main className="p-4 sm:p-6 lg:p-8">

      {/* ======================================
          Header
      ====================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your finances.
          </p>

        </div>


        {transactions.length > 0 &&
          categories.length > 0 && (

            <button
              onClick={() =>
                setShowAddModal(true)
              }
              className="
                inline-flex
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
                focus:ring-blue-200
              "
            >
              <Plus size={18} />
              Add Transaction
            </button>

          )}

      </div>


      {/* ======================================
          Stats
      ====================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total Balance"
          amount={`$${formatAmount(
            totalBalance
          )}`}
          type="balance"
        />

        <StatCard
          title="Total Income"
          amount={`$${formatAmount(
            totalIncome
          )}`}
          type="income"
        />

        <StatCard
          title="Total Expense"
          amount={`$${formatAmount(
            totalExpenses
          )}`}
          type="expense"
        />

      </div>


      {/* ======================================
          Chart + Summary
      ====================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ====================================
            Spending Overview
        ==================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">

          {/* Chart Header */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="font-semibold text-slate-900">
                Spending Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Income and expenses over time
              </p>

            </div>


            <div className="w-full sm:w-44">

              <AnimatedDropdown
                value={chartPeriod}
                onChange={(value) => {

                  setChartPeriod(value);
                  setHoveredChartItem(null);

                }}
                options={chartPeriodOptions}
                placeholder="Select period"
              />

            </div>

          </div>


          {/* Chart Legend */}

          <div className="mt-5 flex flex-wrap items-center gap-5">

            <div className="flex items-center gap-2">

              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <span className="text-xs font-medium text-slate-500">
                Income
              </span>

            </div>


            <div className="flex items-center gap-2">

              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

              <span className="text-xs font-medium text-slate-500">
                Expenses
              </span>

            </div>

          </div>


          {/* Chart */}

          <div className="mt-5 overflow-hidden">

            <div
              className={`
                relative
                w-full
                min-w-0
                ${
                  chartPeriod ===
                  "last-6-months"
                    ? "h-72"
                    : "h-80"
                }
              `}
            >

              {/* Y Axis */}

              <div className="absolute bottom-8 left-0 top-2 flex w-12 flex-col justify-between">

                {[4, 3, 2, 1, 0].map(
                  (value) => (

                    <span
                      key={value}
                      className="text-[10px] text-slate-400"
                    >
                      $
                      {formatAmount(
                        (chartMax / 4) *
                          value
                      )}
                    </span>

                  )
                )}

              </div>


              {/* Grid + Bars */}

              <div className="absolute bottom-8 left-14 right-0 top-2">

                {/* Grid Lines */}

                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">

                  {[0, 1, 2, 3, 4].map(
                    (line) => (

                      <div
                        key={line}
                        className="border-t border-dashed border-slate-100"
                      />

                    )
                  )}

                </div>


                {/* Bars */}

                <div className="absolute inset-0 flex items-end justify-between gap-1">

                  {chartData.map(
                    (item, index) => {

                      const incomeHeight =
                        chartMax > 0
                          ? (item.income /
                              chartMax) *
                            100
                          : 0;


                      const expenseHeight =
                        chartMax > 0
                          ? (item.expense /
                              chartMax) *
                            100
                          : 0;


                      return (

                        <div
                          key={`${item.fullLabel}-${index}`}
                          className="
                            group
                            relative
                            flex
                            h-full
                            flex-1
                            items-end
                            justify-center
                            gap-0.5
                          "
                          onMouseEnter={() =>
                            setHoveredChartItem(
                              index
                            )
                          }
                          onMouseLeave={() =>
                            setHoveredChartItem(
                              null
                            )
                          }
                        >

                          {/* Tooltip */}

                          {hoveredChartItem ===
                            index && (

                            <div
                              className="
                                absolute
                                bottom-full
                                left-1/2
                                z-20
                                mb-2
                                w-36
                                -translate-x-1/2
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                p-3
                                shadow-lg
                              "
                            >

                              <p className="mb-2 text-xs font-semibold text-slate-700">
                                {item.fullLabel}
                              </p>


                              <div className="flex items-center justify-between">

                                <span className="text-[11px] text-slate-400">
                                  Income
                                </span>

                                <span className="text-xs font-semibold text-emerald-600">
                                  $
                                  {formatAmount(
                                    item.income
                                  )}
                                </span>

                              </div>


                              <div className="mt-1 flex items-center justify-between">

                                <span className="text-[11px] text-slate-400">
                                  Expense
                                </span>

                                <span className="text-xs font-semibold text-red-600">
                                  $
                                  {formatAmount(
                                    item.expense
                                  )}
                                </span>

                              </div>

                            </div>

                          )}


                          {/* Income Bar */}

                          <div
                            className="
                              w-full
                              max-w-4
                              origin-bottom
                              rounded-t-md
                              bg-emerald-500
                              transition-all
                              duration-300
                              ease-out
                              hover:opacity-80
                              sm:max-w-5
                            "
                            style={{
                              height: `${Math.max(
                                incomeHeight,
                                item.income > 0
                                  ? 2
                                  : 0
                              )}%`,
                            }}
                          />


                          {/* Expense Bar */}

                          <div
                            className="
                              w-full
                              max-w-4
                              origin-bottom
                              rounded-t-md
                              bg-red-500
                              transition-all
                              duration-300
                              ease-out
                              hover:opacity-80
                              sm:max-w-5
                            "
                            style={{
                              height: `${Math.max(
                                expenseHeight,
                                item.expense > 0
                                  ? 2
                                  : 0
                              )}%`,
                            }}
                          />

                        </div>

                      );

                    }
                  )}

                </div>


                {/* X Axis */}

                <div className="absolute -bottom-7 left-0 right-0 flex justify-between gap-1">

                  {chartData.map(
                    (item, index) => {

                      const shouldShowLabel =
                        chartPeriod ===
                        "last-6-months"
                          ? true
                          : chartData.length <=
                              15
                            ? true
                            : index === 0 ||
                                index ===
                                  chartData.length -
                                    1 ||
                                index %
                                    Math.ceil(
                                      chartData.length /
                                        7
                                    ) ===
                                  0;


                      return (

                        <span
                          key={`label-${item.fullLabel}-${index}`}
                          className={`
                            flex-1
                            text-center
                            text-[10px]
                            text-slate-400
                            ${
                              shouldShowLabel
                                ? "opacity-100"
                                : "opacity-0"
                            }
                          `}
                        >
                          {item.label}
                        </span>

                      );

                    }
                  )}

                </div>

              </div>

            </div>

          </div>


          {/* Chart Summary */}

          <div className="mt-10 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">

            <div>

              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Period Income
              </p>

              <p className="mt-1 text-sm font-semibold text-emerald-600">
                +$
                {formatAmount(
                  chartIncomeTotal
                )}
              </p>

            </div>


            <div>

              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Period Expenses
              </p>

              <p className="mt-1 text-sm font-semibold text-red-600">
                -$
                {formatAmount(
                  chartExpenseTotal
                )}
              </p>

            </div>

          </div>

        </div>


        {/* ====================================
            Quick Summary
        ==================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="font-semibold text-slate-900">
            This Month
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {currentMonthName}
          </p>


          <div className="mt-6 space-y-5">

            {/* Income */}

            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                  <ArrowDownLeft
                    size={18}
                    className="text-emerald-600"
                  />
                </div>


                <div className="min-w-0">

                  <p className="text-sm font-medium text-slate-700">
                    Income
                  </p>

                  <p className="text-xs text-slate-400">
                    This month
                  </p>

                </div>

              </div>


              <p className="shrink-0 text-sm font-semibold text-emerald-600">
                +$
                {formatAmount(
                  monthlyIncome
                )}
              </p>

            </div>


            {/* Expenses */}

            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <ArrowUpRight
                    size={18}
                    className="text-red-600"
                  />
                </div>


                <div className="min-w-0">

                  <p className="text-sm font-medium text-slate-700">
                    Expenses
                  </p>

                  <p className="text-xs text-slate-400">
                    This month
                  </p>

                </div>

              </div>


              <p className="shrink-0 text-sm font-semibold text-red-600">
                -$
                {formatAmount(
                  monthlyExpenses
                )}
              </p>

            </div>


            {/* Net Balance */}

            <div className="border-t border-slate-100 pt-5">

              <div className="flex items-center justify-between gap-3">

                <p className="text-sm font-medium text-slate-500">
                  Net Balance
                </p>

                <p
                  className={`
                    text-lg
                    font-bold
                    ${
                      monthlyNetBalance >=
                      0
                        ? "text-slate-900"
                        : "text-red-600"
                    }
                  `}
                >
                  $
                  {formatAmount(
                    monthlyNetBalance
                  )}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================
          Recent Transactions
      ====================================== */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}

        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="font-semibold text-slate-900">
              Recent Transactions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your latest financial activity
            </p>

          </div>


          <button
            onClick={() =>
              navigate("/transactions")
            }
            className="
              inline-flex
              items-center
              justify-center
              rounded-lg
              px-3
              py-2
              text-sm
              font-medium
              text-blue-600
              transition
              hover:bg-blue-50
              hover:text-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-100
            "
          >
            View All
          </button>

        </div>


        {/* Empty State */}

        {recentTransactions.length === 0 ? (

          <div className="px-5 py-16 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">

              <Receipt
                size={22}
                className="text-slate-400"
              />

            </div>


            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No transactions yet
            </h3>


            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
              Add your first transaction to start tracking your financial activity.
            </p>


            {categories.length > 0 && (

              <button
                onClick={() =>
                  setShowAddModal(true)
                }
                className="
                  mt-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-4
                  py-2
                  text-xs
                  font-medium
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-200
                "
              >
                <Plus size={15} />
                Add Transaction
              </button>

            )}

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {recentTransactions.map(
              (transaction) => (

                <div
                  key={transaction.id}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    p-4
                    transition
                    hover:bg-slate-50
                    sm:p-5
                  "
                >

                  {/* Left */}

                  <div className="flex min-w-0 items-center gap-3">

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
                          transaction.type ===
                          "income"
                            ? "bg-emerald-100"
                            : "bg-red-100"
                        }
                      `}
                    >

                      {transaction.type ===
                      "income" ? (

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

                      <p className="truncate text-sm font-medium text-slate-900">
                        {transaction.description ||
                          "Untitled Transaction"}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {getCategoryName(
                          transaction.category_id
                        )}

                        {" · "}

                        {formatDate(
                          transaction.created_at
                        )}
                      </p>

                    </div>

                  </div>


                  {/* Amount */}

                  <p
                    className={`
                      shrink-0
                      text-sm
                      font-semibold
                      ${
                        transaction.type ===
                        "income"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }
                    `}
                  >
                    {transaction.type ===
                    "income"
                      ? "+"
                      : "-"}

                    $

                    {formatAmount(
                      transaction.amount
                    )}

                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* ======================================
          Add Transaction Modal
      ====================================== */}

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() =>
          setShowAddModal(false)
        }
        categories={categories}
        onTransactionAdded={
          handleTransactionAdded
        }
      />

    </main>

  );
};


export default Dashboard;