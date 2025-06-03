import { useState } from "react";
import { useGetDashboardQuery } from "../../app/services/authApi";
import { useEffect } from "react";

export default function Dashboard() {
  // Sample data for dashboard metrics

  const { data, isLoading, error } = useGetDashboardQuery();

  const [metrics, setMetrics] = useState({
    users: {
      today: { value: "---", change: "---" },
      weekly: { value: "---", change: "---" },
      monthly: { value: "---", change: "---" },
      total: { value: "---", change: null },
    },
    premiumUsers: {
      today: { value: "---", change: "---" },
      weekly: { value: "---", change: "---" },
      monthly: { value: "---", change: "---" },
      total: { value: null, change: null },
    },
    wribates: {
      today: { value: "---", change: "---" },
      weekly: { value: "---", change: "---" },
      monthly: { value: "---", change: "---" },
      total: { value: "---", change: null },
    },
    featuredWribates: {
      today: { value: "---", change: "---" },
      weekly: { value: "---", change: "---" },
      monthly: { value: "---", change: "---" },
      total: { value: null, change: null },
    },
    adViews: {
      today: { value: "---", change: "---" },
      weekly: { value: "---", change: "---" },
      monthly: { value: "---", change: "---" },
      total: { value: null, change: null },
    },
    wribateAmount: {
      today: { value: "---", change: "---" },
      weekly: { value: "---", change: "---" },
      monthly: { value: "---", change: "---" },
      total: { value: "---", change: null },
    }
  });

  useEffect(() => {
    if (data && data.status && data.status === "success") {

      const userStats = data.data.userStats
      const wribateStats = data.data.wribateStats
      const amountStats = data.data.completedTransactionStats

      function findCount(period, stats, idValue) {
        if (!stats || !stats[period] || !Array.isArray(stats[period])) return 0;
        return stats[period].find(obj => obj._id === idValue)?.count || 0;
      }

      function getPercent(oldValue, newValue) {
        return oldValue ? ((oldValue - newValue) * 100 / oldValue).toFixed(1) : 0
      }

      setMetrics({
        users: {
          today: {
            value: findCount("day", userStats, 1),
            change: getPercent(findCount("prevDay", userStats, 1), findCount("day", userStats, 1))
          },
          weekly: {
            value: findCount("week", userStats, 1),
            change: getPercent(findCount("prevWeek", userStats, 1), findCount("week", userStats, 1))
          },
          monthly: {
            value: findCount("month", userStats, 1),
            change: getPercent(findCount("prevMonth", userStats, 1), findCount("month", userStats, 1))
          },
          total: {
            value: findCount("total", userStats, 1),
            change: null
          },
        },
        premiumUsers: {
          today: { value: "---", change: "---" },
          weekly: { value: "---", change: "---" },
          monthly: { value: "---", change: "---" },
          total: { value: null, change: null },
        },
        wribates: {
          today: {
            value: findCount("day", wribateStats, "Free") + findCount("day", wribateStats, "Sponsored"),
            change: getPercent(findCount("prevDay", wribateStats, "Free") + findCount("prevDay", wribateStats, "Sponsored")
              , findCount("day", wribateStats, "Free") + findCount("day", wribateStats, "Sponsored"))
          },
          weekly: {
            value: findCount("week", wribateStats, "Free") + findCount("week", wribateStats, "Sponsored"),
            change: getPercent(findCount("prevWeek", wribateStats, "Free") + findCount("prevWeek", wribateStats, "Sponsored"),
              findCount("week", wribateStats, "Free") + findCount("week", wribateStats, "Sponsored"))
          },
          monthly: {
            value: findCount("month", wribateStats, "Free") + findCount("month", wribateStats, "Sponsored"),
            change: getPercent(findCount("prevMonth", wribateStats, "Free") + findCount("prevMonth", wribateStats, "Sponsored")
              , findCount("month", wribateStats, "Free") + findCount("month", wribateStats, "Sponsored"))
          },
          total: {
            value: findCount("total", wribateStats, "Free") + findCount("total", wribateStats, "Sponsored"),
            change: null
          },
        },
        featuredWribates: {
          today: {
            value: findCount("day", wribateStats, "Sponsored"),
            change: getPercent(findCount("prevDay", wribateStats, "Sponsored"), findCount("day", wribateStats, "Sponsored"))
          },
          weekly: {
            value: findCount("week", wribateStats, "Sponsored"),
            change: getPercent(findCount("prevWeek", wribateStats, "Sponsored"), findCount("week", wribateStats, "Sponsored"))
          },
          monthly: {
            value: findCount("month", wribateStats, "Sponsored"),
            change: getPercent(findCount("prevMonth", wribateStats, "Sponsored"), findCount("month", wribateStats, "Sponsored"))
          },
          total: {
            value: findCount("total", wribateStats, "Sponsored"),
            change: null
          },
        },
        adViews: {
          today: { value: "---", change: "---" },
          weekly: { value: "---", change: "---" },
          monthly: { value: "---", change: "---" },
          total: { value: null, change: null },
        },
        wribateAmount: {
          today: {
            value: findCount("day", amountStats, null),
            change: getPercent(findCount("prevDay", amountStats, null), findCount("day", amountStats, null))
          },
          weekly: {
            value: findCount("week", amountStats, null),
            change: getPercent(findCount("prevWeek", amountStats, null), findCount("week", amountStats, null))
          },
          monthly: {
            value: findCount("month", amountStats, null),
            change: getPercent(findCount("prevMonth", amountStats, null), findCount("month", amountStats, null))
          },
          total: {
            value: findCount("total", amountStats, null),
            change: null
          },
        },
      });
    }
  }, [data]);
  if (isLoading) {
    return <div className="flex justify-center items-center h-48">
      <div className="flex items-center space-x-2">
        <svg
          className="animate-spin h-5 w-5 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="text-gray-700">Loading stats...</span>
      </div>
    </div>;
  }

  const periods = ["Today", "Weekly", "Monthly", "Total"];
  const metrics_keys = [
    { key: "users", label: "Users" },
    { key: "premiumUsers", label: "Premium Users" },
    { key: "wribates", label: "Wribates" },
    { key: "featuredWribates", label: "Featured Wribates" },
    { key: "adViews", label: "Ad Views" },
    { key: "wribateAmount", label: "Wribate Amount" },
  ];

  const getTimeKey = (period) => {
    return period.toLowerCase();
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-5 gap-2 mb-4">
        <div className="text-center font-semibold text-lg"></div>
        {periods.map((period) => (
          <div key={period} className="text-center ">
            <div className="font-semibold text-lg">
              {period}
            </div>
            {(period == "Weekly" || period == "Monthly") &&
              <div>
                (Last {period == "Weekly" ? 7 : 30} days)
              </div>
            }
          </div>
        ))}
      </div>

      {metrics_keys.map(({ key, label }) => (
        <div key={key} className="grid grid-cols-5 gap-2 mb-4">
          <div className="flex items-center text-lg text-black font-bold">
            {label}
          </div>

          {periods.map((period) => {
            const timeKey = getTimeKey(period);
            const data = metrics[key][timeKey];

            return (
              <div
                key={`${key}-${period}`}
                className="bg-blue-500 text-white p-3 rounded-lg shadow flex flex-col justify-center"
              >
                <div className="text-2xl font-bold">{data.value}</div>
                {(data.change || data.change == 0) && (
                  <div className="text-sm font-medium">
                    {data.change} % {data.change < 0 ? "decrease" : "increase"} from {period == "Today" ? "yesterday" : "last " + period.slice(0, -2)?.toLowerCase()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
