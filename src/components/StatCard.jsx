import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
} from "lucide-react";

const StatCard = ({ title, amount, type }) => {
  const config = {
    balance: {
      icon: Wallet,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    income: {
      icon: ArrowDownToLine,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    expense: {
      icon: ArrowUpFromLine,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  };

  const { icon: Icon, iconBg, iconColor } = config[type];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {amount}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon size={21} className={iconColor} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs font-medium text-emerald-600">
          +12.5%
        </span>

        <span className="text-xs text-slate-400">
          from last month
        </span>
      </div>
    </div>
  );
};

export default StatCard;