import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowDown,
  ArrowUp,
  Wallet,
  Receipt,
  TrendingUp,
  CalendarDays,
  RefreshCw,
  PieChart,
  BarChart3,
  Filter,
  Info,
  ChevronDown,
  Check,
} from "lucide-react";

import api from "../services/api";


const Reports = () => {

  // ==========================================
  // Current Year
  // ==========================================

  const currentYear = new Date().getFullYear();


  // ==========================================
  // State
  // ==========================================

  const [reports, setReports] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [selectedYear, setSelectedYear] =
    useState(currentYear);

  const [yearDropdownOpen, setYearDropdownOpen] =
    useState(false);

  const [dateError, setDateError] = useState("");

  const startDateRef = useRef(null);

  const endDateRef = useRef(null);

  const yearDropdownRef = useRef(null);


  // ==========================================
  // Available Years
  // ==========================================

  const availableYears = useMemo(() => {
    return Array.from(
      { length: 7 },
      (_, index) => currentYear - 3 + index
    );
  }, [currentYear]);


  // ==========================================
  // Fetch Reports
  // ==========================================

  const fetchReports = async () => {

    try {

      setLoading(true);
      setError("");

      const params = {
        year: selectedYear,
      };


      if (startDate) {
        params.start_date = startDate;
      }


      if (endDate) {
        params.end_date = endDate;
      }


      const response = await api.get(
        "/reports/",
        {
          params,
        }
      );


      setReports(response.data);

    } catch (error) {

      console.error(
        "Error fetching reports:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Failed to load reports."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // Initial / Year Change Fetch
  // ==========================================

  useEffect(() => {
    fetchReports();
  }, [selectedYear]);


  // ==========================================
  // Close Year Dropdown
  // When Clicking Outside
  // ==========================================

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setYearDropdownOpen(false);
      }

    };


    const handleEscape = (event) => {

      if (event.key === "Escape") {
        setYearDropdownOpen(false);
      }

    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, []);


  // ==========================================
  // Apply Filters
  // ==========================================

  const handleApplyFilter = () => {

    setDateError("");
    setError("");


    // ----------------------------------------
    // Start Date Format Validation
    // ----------------------------------------

    if (
      startDate &&
      !isValidDateFormat(startDate)
    ) {

      setDateError(
        "Start date must be in YYYY-MM-DD format."
      );

      return;
    }


    // ----------------------------------------
    // End Date Format Validation
    // ----------------------------------------

    if (
      endDate &&
      !isValidDateFormat(endDate)
    ) {

      setDateError(
        "End date must be in YYYY-MM-DD format."
      );

      return;
    }


    // ----------------------------------------
    // Date Range Validation
    // ----------------------------------------

    if (
      startDate &&
      endDate &&
      startDate > endDate
    ) {

      setDateError(
        "Start date cannot be greater than end date."
      );

      return;
    }


    fetchReports();

  };


  // ==========================================
  // Reset Filters
  // ==========================================

  const handleReset = () => {

    setStartDate("");

    setEndDate("");

    setDateError("");

    setError("");

    setYearDropdownOpen(false);


    if (selectedYear === currentYear) {

      fetchReports();

    } else {

      setSelectedYear(currentYear);

    }

  };


  // ==========================================
  // Date Validation
  // ==========================================

  const isValidDateFormat = (value) => {

    const regex =
      /^\d{4}-\d{2}-\d{2}$/;


    if (!regex.test(value)) {
      return false;
    }


    const [year, month, day] =
      value.split("-").map(Number);


    const date = new Date(
      year,
      month - 1,
      day
    );


    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );

  };


  // ==========================================
  // Manual Date Change
  // ==========================================

  const handleStartDateChange = (e) => {

    const value = e.target.value;

    setStartDate(value);

    setDateError("");

  };


  const handleEndDateChange = (e) => {

    const value = e.target.value;

    setEndDate(value);

    setDateError("");

  };


  // ==========================================
  // Open Native Calendar
  // ==========================================

  const openCalendar = (ref) => {

    if (
      ref.current &&
      typeof ref.current.showPicker === "function"
    ) {

      ref.current.showPicker();

      return;
    }


    ref.current?.focus();

  };


  // ==========================================
  // Select Year
  // ==========================================

  const handleYearSelect = (year) => {

    setSelectedYear(year);

    setYearDropdownOpen(false);

  };


  // ==========================================
  // Currency Formatter
  // ==========================================

  const formatAmount = (amount) => {

    return new Intl.NumberFormat(
      "en-PK",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(
      Number(amount || 0)
    );

  };


  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "";
    }


    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

  };


  // ==========================================
  // Monthly Trends
  // ==========================================

  const monthlyTrends =
    reports?.monthly_trends || [];


  // ==========================================
  // Visible Monthly Trends
  //
  // Hide months before the first month
  // with actual activity.
  // ==========================================

  const visibleMonthlyTrends =
    useMemo(() => {

      if (!monthlyTrends.length) {
        return [];
      }


      const firstActiveIndex =
        monthlyTrends.findIndex(
          (month) => {

            const income =
              Number(month.income || 0);

            const expense =
              Number(month.expense || 0);


            return (
              income !== 0 ||
              expense !== 0
            );

          }
        );


      if (firstActiveIndex === -1) {
        return [];
      }


      return monthlyTrends.slice(
        firstActiveIndex
      );

    }, [monthlyTrends]);


  // ==========================================
  // Maximum Monthly Value
  // ==========================================

  const maxMonthlyValue =
    useMemo(() => {

      if (
        !visibleMonthlyTrends.length
      ) {
        return 1;
      }


      const values =
        visibleMonthlyTrends.flatMap(
          (month) => [

            Number(
              month.income || 0
            ),

            Number(
              month.expense || 0
            ),

          ]
        );


      return Math.max(
        ...values,
        1
      );

    }, [visibleMonthlyTrends]);


  // ==========================================
  // Report Data
  // ==========================================

  const summary =
    reports?.summary || {};


  const categoryBreakdown =
    reports?.category_breakdown || [];


  const hasDateFilter =
    Boolean(
      startDate ||
      endDate
    );


  // ==========================================
  // Loading Screen
  // ==========================================

  if (
    loading &&
    !reports
  ) {

    return (
      <main className="p-4 sm:p-6 lg:p-8">

        <div className="mb-6">

          <h1 className="text-2xl font-bold text-slate-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Analyze your income, expenses, and spending patterns.
          </p>

        </div>


        <div className="
          flex
          min-h-80
          items-center
          justify-center
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        ">

          <div className="flex flex-col items-center">

            <RefreshCw
              size={25}
              className="animate-spin text-blue-600"
            />

            <p className="mt-3 text-sm font-medium text-slate-600">
              Loading reports...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Preparing your financial overview.
            </p>

          </div>

        </div>

      </main>
    );

  }


  // ==========================================
  // Error Screen
  // ==========================================

  if (
    error &&
    !reports
  ) {

    return (
      <main className="p-4 sm:p-6 lg:p-8">

        <div className="mb-6">

          <h1 className="text-2xl font-bold text-slate-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Analyze your income, expenses, and spending patterns.
          </p>

        </div>


        <div className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-6
        ">

          <div className="flex items-start gap-3">

            <div className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-red-100
            ">

              <Info
                size={18}
                className="text-red-600"
              />

            </div>


            <div>

              <p className="text-sm font-semibold text-red-700">
                Unable to load reports
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

            </div>

          </div>


          <button
            onClick={fetchReports}
            className="
              mt-5
              inline-flex
              items-center
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
            "
          >

            <RefreshCw size={16} />

            Try Again

          </button>

        </div>

      </main>
    );

  }


  return (
    <main className="p-4 sm:p-6 lg:p-8">

      {/* ======================================
          Header
      ====================================== */}

      <div className="
        mb-6
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-end
        sm:justify-between
      ">

        <div>

          <div className="flex items-center gap-2">

            <h1 className="text-2xl font-bold text-slate-900">
              Reports
            </h1>


            {loading && (
              <RefreshCw
                size={16}
                className="animate-spin text-blue-600"
              />
            )}

          </div>


          <p className="mt-1 text-sm text-slate-500">
            Analyze your income, expenses, and spending patterns.
          </p>

        </div>


        <div className="
          hidden
          items-center
          gap-2
          rounded-lg
          bg-slate-100
          px-3
          py-2
          text-xs
          font-medium
          text-slate-600
          sm:flex
        ">

          <BarChart3 size={15} />

          {selectedYear} Overview

        </div>

      </div>


      {/* ======================================
          Filters
      ====================================== */}

      <div className="
        mb-6
        overflow-visible
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      ">

        {/* Filter Header */}

        <div className="
          border-b
          border-slate-100
          px-5
          py-4
          sm:px-6
        ">

          <div className="flex items-center gap-2">

            <div className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-blue-100
              text-blue-600
            ">

              <Filter size={17} />

            </div>


            <div>

              <h2 className="font-semibold text-slate-900">
                Report Filters
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Narrow down the data you want to analyze.
              </p>

            </div>

          </div>

        </div>


        {/* Filter Body */}

        <div className="p-5 sm:p-6">

          <div className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-4
          ">


            {/* ==================================
                Start Date
            ================================== */}

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              ">
                Start Date
              </label>


              <div className="relative">

                <input
                  ref={startDateRef}
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="
                    pointer-events-none
                    absolute
                    h-0
                    w-0
                    opacity-0
                  "
                  tabIndex={-1}
                  aria-hidden="true"
                />


                <div className="
                  flex
                  h-11
                  w-full
                  items-center
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  transition
                  focus-within:border-blue-500
                  focus-within:ring-2
                  focus-within:ring-blue-100
                ">

                  <input
                    type="text"
                    value={startDate}
                    onChange={handleStartDateChange}
                    placeholder="YYYY-MM-DD"
                    inputMode="numeric"
                    maxLength={10}
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-3
                      py-2.5
                      text-sm
                      text-slate-700
                      outline-none
                      placeholder:text-slate-400
                    "
                  />


                  <button
                    type="button"
                    onClick={() =>
                      openCalendar(startDateRef)
                    }
                    className="
                      mr-1
                      rounded-md
                      p-2
                      text-slate-400
                      transition
                      hover:bg-slate-100
                      hover:text-blue-600
                    "
                    title="Open calendar"
                  >

                    <CalendarDays size={18} />

                  </button>

                </div>

              </div>

            </div>


            {/* ==================================
                End Date
            ================================== */}

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              ">
                End Date
              </label>


              <div className="relative">

                <input
                  ref={endDateRef}
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="
                    pointer-events-none
                    absolute
                    h-0
                    w-0
                    opacity-0
                  "
                  tabIndex={-1}
                  aria-hidden="true"
                />


                <div className="
                  flex
                  h-11
                  w-full
                  items-center
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  transition
                  focus-within:border-blue-500
                  focus-within:ring-2
                  focus-within:ring-blue-100
                ">

                  <input
                    type="text"
                    value={endDate}
                    onChange={handleEndDateChange}
                    placeholder="YYYY-MM-DD"
                    inputMode="numeric"
                    maxLength={10}
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-3
                      py-2.5
                      text-sm
                      text-slate-700
                      outline-none
                      placeholder:text-slate-400
                    "
                  />


                  <button
                    type="button"
                    onClick={() =>
                      openCalendar(endDateRef)
                    }
                    className="
                      mr-1
                      rounded-md
                      p-2
                      text-slate-400
                      transition
                      hover:bg-slate-100
                      hover:text-blue-600
                    "
                    title="Open calendar"
                  >

                    <CalendarDays size={18} />

                  </button>

                </div>

              </div>

            </div>


            {/* ==================================
                Animated Year Dropdown
            ================================== */}

            <div
              ref={yearDropdownRef}
              className="relative"
            >

              <label className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
              ">
                Trend Year
              </label>


              {/* Dropdown Trigger */}

              <button
                type="button"
                onClick={() =>
                  setYearDropdownOpen(
                    (prev) => !prev
                  )
                }
                className={`
                  flex
                  h-11
                  w-full
                  items-center
                  justify-between
                  rounded-lg
                  border
                  bg-white
                  px-3
                  text-left
                  text-sm
                  font-medium
                  text-slate-700
                  outline-none
                  transition-all
                  duration-200
                  ${
                    yearDropdownOpen
                      ? "border-blue-500 ring-2 ring-blue-100"
                      : "border-slate-200 hover:border-slate-300"
                  }
                `}
              >

                <span>
                  {selectedYear}
                </span>


                <ChevronDown
                  size={18}
                  className={`
                    text-slate-400
                    transition-transform
                    duration-200
                    ${
                      yearDropdownOpen
                        ? "rotate-180"
                        : "rotate-0"
                    }
                  `}
                />

              </button>


              {/* Animated Dropdown Menu */}

              <div
                className={`
                  absolute
                  left-0
                  right-0
                  top-full
                  z-50
                  mt-2
                  origin-top
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  shadow-lg
                  shadow-slate-200/60
                  transition-all
                  duration-200
                  ${
                    yearDropdownOpen
                      ? "visible translate-y-0 scale-100 opacity-100"
                      : "invisible -translate-y-2 scale-95 opacity-0"
                  }
                `}
              >

                <div className="p-1.5">

                  {availableYears.map(
                    (year) => (

                      <button
                        key={year}
                        type="button"
                        onClick={() =>
                          handleYearSelect(
                            year
                          )
                        }
                        className={`
                          flex
                          w-full
                          items-center
                          justify-between
                          rounded-lg
                          px-3
                          py-2.5
                          text-sm
                          transition-colors
                          ${
                            selectedYear === year
                              ? "bg-blue-50 font-semibold text-blue-600"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }
                        `}
                      >

                        <span>
                          {year}
                        </span>


                        {selectedYear ===
                          year && (
                          <Check
                            size={16}
                            className="text-blue-600"
                          />
                        )}

                      </button>

                    )
                  )}

                </div>

              </div>

            </div>


            {/* ==================================
                Buttons
            ================================== */}

            <div className="
              flex
              items-end
              gap-2
            ">

              <button
                onClick={handleApplyFilter}
                disabled={loading}
                className="
                  flex
                  h-11
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-4
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

                <BarChart3 size={17} />

                {loading
                  ? "Loading..."
                  : "Apply Filters"}

              </button>


              <button
                onClick={handleReset}
                disabled={loading}
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  text-slate-500
                  transition
                  hover:bg-slate-50
                  hover:text-slate-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                title="Reset filters"
              >

                <RefreshCw size={17} />

              </button>

            </div>

          </div>


          {/* ==================================
              Date Error
          ================================== */}

          {dateError && (

            <div className="
              mt-4
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-red-100
              bg-red-50
              px-3
              py-2.5
              text-sm
              text-red-600
            ">

              <Info size={16} />

              {dateError}

            </div>

          )}


          {/* ==================================
              Report Range
          ================================== */}

          {(reports?.start_date ||
            reports?.end_date) && (

            <div className="
              mt-5
              flex
              flex-wrap
              items-center
              gap-2
              border-t
              border-slate-100
              pt-4
              text-xs
              text-slate-500
            ">

              <CalendarDays size={14} />

              <span>
                Showing report from
              </span>


              <span className="
                rounded-md
                bg-slate-100
                px-2
                py-1
                font-medium
                text-slate-700
              ">
                {formatDate(
                  reports?.start_date
                )}
              </span>


              <span>
                to
              </span>


              <span className="
                rounded-md
                bg-slate-100
                px-2
                py-1
                font-medium
                text-slate-700
              ">
                {formatDate(
                  reports?.end_date
                )}
              </span>


              {hasDateFilter && (

                <span className="
                  rounded-full
                  bg-blue-50
                  px-2
                  py-1
                  text-blue-600
                ">
                  Custom range
                </span>

              )}

            </div>

          )}


          {/* ==================================
              API Error
          ================================== */}

          {error && reports && (

            <div className="
              mt-4
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-red-100
              bg-red-50
              px-3
              py-2.5
              text-sm
              text-red-600
            ">

              <Info size={16} />

              {error}

            </div>

          )}

        </div>

      </div>


      {/* ======================================
          Summary Cards
      ====================================== */}

      <div className="
        mb-6
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      ">


        {/* Income */}

        <div className="
          group
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:shadow-md
        ">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Total Income
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                Rs.{" "}
                {formatAmount(
                  summary.total_income
                )}
              </p>

            </div>


            <div className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-emerald-100
              text-emerald-600
              transition
              group-hover:scale-105
            ">

              <ArrowUp size={21} />

            </div>

          </div>


          <p className="mt-4 text-xs text-slate-400">
            Money received during this period
          </p>

        </div>


        {/* Expense */}

        <div className="
          group
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:shadow-md
        ">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Total Expense
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                Rs.{" "}
                {formatAmount(
                  summary.total_expense
                )}
              </p>

            </div>


            <div className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-red-100
              text-red-600
              transition
              group-hover:scale-105
            ">

              <ArrowDown size={21} />

            </div>

          </div>


          <p className="mt-4 text-xs text-slate-400">
            Money spent during this period
          </p>

        </div>


        {/* Balance */}

        <div className="
          group
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:shadow-md
        ">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Balance
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                Rs.{" "}
                {formatAmount(
                  summary.balance
                )}
              </p>

            </div>


            <div className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-blue-100
              text-blue-600
              transition
              group-hover:scale-105
            ">

              <Wallet size={21} />

            </div>

          </div>


          <p className="mt-4 text-xs text-slate-400">
            Income minus expenses
          </p>

        </div>


        {/* Transactions */}

        <div className="
          group
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:shadow-md
        ">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Transactions
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {summary.transaction_count || 0}
              </p>

            </div>


            <div className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-purple-100
              text-purple-600
              transition
              group-hover:scale-105
            ">

              <Receipt size={21} />

            </div>

          </div>


          <p className="mt-4 text-xs text-slate-400">
            Recorded transactions in this period
          </p>

        </div>

      </div>


      {/* ======================================
          Main Reports
      ====================================== */}

      <div className="
        grid
        grid-cols-1
        gap-6
        xl:grid-cols-2
      ">


        {/* ====================================
            Category Breakdown
        ==================================== */}

        <div className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          sm:p-6
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <h2 className="font-semibold text-slate-900">
                Expense by Category
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Where your money is being spent
              </p>

            </div>


            <div className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-blue-100
              text-blue-600
            ">

              <PieChart size={19} />

            </div>

          </div>


          {categoryBreakdown.length === 0 ? (

            <div className="
              flex
              min-h-52
              items-center
              justify-center
            ">

              <div className="text-center">

                <PieChart
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm text-slate-500">
                  No expense data available.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Try another date range or add an expense.
                </p>

              </div>

            </div>

          ) : (

            <div className="mt-6 space-y-5">

              {categoryBreakdown.map(
                (category) => {

                  const totalExpense =
                    Number(
                      summary.total_expense || 0
                    );


                  const categoryTotal =
                    Number(
                      category.total || 0
                    );


                  const percentage =
                    totalExpense > 0
                      ? (
                          categoryTotal /
                          totalExpense
                        ) * 100
                      : 0;


                  return (

                    <div
                      key={
                        category.category_id
                      }
                    >

                      <div className="
                        mb-2
                        flex
                        items-center
                        justify-between
                        gap-3
                      ">

                        <p className="
                          truncate
                          text-sm
                          font-medium
                          text-slate-700
                        ">
                          {category.category_name}
                        </p>


                        <div className="
                          flex
                          shrink-0
                          items-center
                          gap-3
                        ">

                          <span className="text-xs text-slate-400">
                            {percentage.toFixed(1)}%
                          </span>

                          <span className="
                            text-sm
                            font-semibold
                            text-slate-900
                          ">
                            Rs.{" "}
                            {formatAmount(
                              category.total
                            )}
                          </span>

                        </div>

                      </div>


                      <div className="
                        h-2
                        overflow-hidden
                        rounded-full
                        bg-slate-100
                      ">

                        <div
                          className="
                            h-full
                            rounded-full
                            bg-blue-600
                            transition-all
                            duration-500
                          "
                          style={{
                            width: `${Math.min(
                              percentage,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </div>


        {/* ====================================
            Monthly Trends
        ==================================== */}

        <div className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          sm:p-6
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <h2 className="font-semibold text-slate-900">
                Monthly Trends
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Income and expenses from your first active month
              </p>

            </div>


            <div className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-blue-100
              text-blue-600
            ">

              <TrendingUp size={19} />

            </div>

          </div>


          {/* Legend */}

          <div className="
            mt-5
            flex
            items-center
            gap-5
            text-xs
            text-slate-500
          ">

            <div className="flex items-center gap-2">

              <span className="
                h-2.5
                w-2.5
                rounded-full
                bg-emerald-500
              " />

              Income

            </div>


            <div className="flex items-center gap-2">

              <span className="
                h-2.5
                w-2.5
                rounded-full
                bg-red-500
              " />

              Expense

            </div>

          </div>


          {visibleMonthlyTrends.length === 0 ? (

            <div className="
              flex
              min-h-64
              items-center
              justify-center
            ">

              <div className="text-center">

                <TrendingUp
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <p className="
                  mt-3
                  text-sm
                  font-medium
                  text-slate-600
                ">
                  No monthly activity
                </p>

                <p className="
                  mt-1
                  max-w-xs
                  text-xs
                  text-slate-400
                ">
                  There are no income or expense records for {selectedYear}.
                </p>

              </div>

            </div>

          ) : (

            <div className="mt-6">

              <div className="flex h-64 gap-2">

                {/* Y Axis */}

                <div className="
                  flex
                  w-14
                  flex-col
                  justify-between
                  pb-6
                  text-right
                  text-[10px]
                  text-slate-400
                ">

                  <span>
                    {formatAmount(
                      maxMonthlyValue
                    )}
                  </span>

                  <span>
                    {formatAmount(
                      maxMonthlyValue / 2
                    )}
                  </span>

                  <span>
                    Rs. 0
                  </span>

                </div>


                {/* Bars */}

                <div className="
                  flex
                  min-w-0
                  flex-1
                  items-end
                  gap-1
                  overflow-x-auto
                  pb-6
                ">

                  {visibleMonthlyTrends.map(
                    (month) => {

                      const income =
                        Number(
                          month.income || 0
                        );


                      const expense =
                        Number(
                          month.expense || 0
                        );


                      const incomeHeight =
                        (
                          income /
                          maxMonthlyValue
                        ) * 100;


                      const expenseHeight =
                        (
                          expense /
                          maxMonthlyValue
                        ) * 100;


                      return (

                        <div
                          key={month.month}
                          className="
                            flex
                            h-full
                            min-w-8.5
                            flex-1
                            flex-col
                            justify-end
                          "
                        >

                          <div className="
                            flex
                            h-full
                            items-end
                            justify-center
                            gap-0.5
                          ">

                            <div
                              title={`Income: Rs. ${formatAmount(income)}`}
                              className="
                                w-3
                                rounded-t-sm
                                bg-emerald-500
                                transition-all
                                hover:opacity-80
                              "
                              style={{
                                height: `${Math.max(
                                  incomeHeight,
                                  income > 0
                                    ? 2
                                    : 0
                                )}%`,
                              }}
                            />


                            <div
                              title={`Expense: Rs. ${formatAmount(expense)}`}
                              className="
                                w-3
                                rounded-t-sm
                                bg-red-500
                                transition-all
                                hover:opacity-80
                              "
                              style={{
                                height: `${Math.max(
                                  expenseHeight,
                                  expense > 0
                                    ? 2
                                    : 0
                                )}%`,
                              }}
                            />

                          </div>


                          <span className="
                            mt-2
                            text-center
                            text-[10px]
                            text-slate-400
                          ">
                            {month.month_name.slice(
                              0,
                              3
                            )}
                          </span>

                        </div>

                      );

                    }
                  )}

                </div>

              </div>

            </div>

          )}

        </div>

      </div>


      {/* ======================================
          Monthly Details
      ====================================== */}

      <div className="
        mt-6
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      ">

        <div className="
          border-b
          border-slate-100
          px-5
          py-4
          sm:px-6
        ">

          <div className="
            flex
            items-center
            justify-between
            gap-3
          ">

            <div>

              <h2 className="font-semibold text-slate-900">
                Monthly Details
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Showing months from your first active month onward.
              </p>

            </div>


            <div className="
              hidden
              rounded-lg
              bg-slate-50
              px-3
              py-2
              text-xs
              font-medium
              text-slate-500
              sm:block
            ">

              {visibleMonthlyTrends.length}{" "}

              {visibleMonthlyTrends.length === 1
                ? "month"
                : "months"}

            </div>

          </div>

        </div>


        {visibleMonthlyTrends.length === 0 ? (

          <div className="
            px-5
            py-12
            text-center
          ">

            <div className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-slate-100
            ">

              <CalendarDays
                size={21}
                className="text-slate-400"
              />

            </div>


            <p className="
              mt-4
              text-sm
              font-medium
              text-slate-700
            ">
              No monthly details available
            </p>


            <p className="
              mt-1
              text-xs
              text-slate-400
            ">
              Add transactions for {selectedYear} to see monthly activity.
            </p>

          </div>

        ) : (

          <>

            {/* Desktop */}

            <div className="
              hidden
              overflow-x-auto
              sm:block
            ">

              <table className="w-full">

                <thead>

                  <tr className="
                    border-b
                    border-slate-100
                    bg-slate-50
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  ">

                    <th className="px-6 py-4">
                      Month
                    </th>

                    <th className="px-6 py-4">
                      Income
                    </th>

                    <th className="px-6 py-4">
                      Expense
                    </th>

                    <th className="px-6 py-4">
                      Balance
                    </th>

                  </tr>

                </thead>


                <tbody className="
                  divide-y
                  divide-slate-100
                ">

                  {visibleMonthlyTrends.map(
                    (month) => {

                      const income =
                        Number(
                          month.income || 0
                        );


                      const expense =
                        Number(
                          month.expense || 0
                        );


                      const balance =
                        Number(
                          month.balance || 0
                        );


                      return (

                        <tr
                          key={month.month}
                          className="
                            transition
                            hover:bg-slate-50
                          "
                        >

                          <td className="
                            px-6
                            py-4
                            text-sm
                            font-semibold
                            text-slate-700
                          ">
                            {month.month_name}
                          </td>


                          <td className="
                            px-6
                            py-4
                            text-sm
                            font-medium
                            text-emerald-600
                          ">
                            Rs.{" "}
                            {formatAmount(
                              income
                            )}
                          </td>


                          <td className="
                            px-6
                            py-4
                            text-sm
                            font-medium
                            text-red-600
                          ">
                            Rs.{" "}
                            {formatAmount(
                              expense
                            )}
                          </td>


                          <td className={`
                            px-6
                            py-4
                            text-sm
                            font-semibold
                            ${
                              balance >= 0
                                ? "text-slate-900"
                                : "text-red-600"
                            }
                          `}>
                            Rs.{" "}
                            {formatAmount(
                              balance
                            )}
                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>


            {/* Mobile */}

            <div className="
              divide-y
              divide-slate-100
              sm:hidden
            ">

              {visibleMonthlyTrends.map(
                (month) => {

                  const income =
                    Number(
                      month.income || 0
                    );


                  const expense =
                    Number(
                      month.expense || 0
                    );


                  const balance =
                    Number(
                      month.balance || 0
                    );


                  return (

                    <div
                      key={month.month}
                      className="p-4"
                    >

                      <div className="
                        mb-3
                        flex
                        items-center
                        justify-between
                        gap-3
                      ">

                        <p className="
                          text-sm
                          font-semibold
                          text-slate-800
                        ">
                          {month.month_name}
                        </p>


                        <p className={`
                          text-sm
                          font-semibold
                          ${
                            balance >= 0
                              ? "text-slate-900"
                              : "text-red-600"
                          }
                        `}>
                          Rs.{" "}
                          {formatAmount(
                            balance
                          )}
                        </p>

                      </div>


                      <div className="
                        grid
                        grid-cols-2
                        gap-3
                      ">

                        <div className="
                          rounded-lg
                          bg-emerald-50
                          p-3
                        ">

                          <p className="text-xs text-emerald-600">
                            Income
                          </p>

                          <p className="
                            mt-1
                            text-sm
                            font-semibold
                            text-emerald-700
                          ">
                            Rs.{" "}
                            {formatAmount(
                              income
                            )}
                          </p>

                        </div>


                        <div className="
                          rounded-lg
                          bg-red-50
                          p-3
                        ">

                          <p className="text-xs text-red-600">
                            Expense
                          </p>

                          <p className="
                            mt-1
                            text-sm
                            font-semibold
                            text-red-700
                          ">
                            Rs.{" "}
                            {formatAmount(
                              expense
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          </>

        )}

      </div>
      

    </main>
  );
};


export default Reports;