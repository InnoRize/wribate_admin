import { useState } from "react";
import { useGetDashboardQuery } from "../../app/services/authApi";

export default function Dashboard() {
  // Sample data for dashboard metrics

  const { data, isLoading, error } = useGetDashboardQuery({
    startDate: "2025-04-24",
    endDate: "2025-04-25",
  });

  if (data) {
    console.log(data);
  }
  const [metrics] = useState({
    users: {
      today: { value: 200, change: "+20%" },
      weekly: { value: 1250, change: "+15%" },
      monthly: { value: 5400, change: "+32%" },
      total: { value: 24680, change: null },
    },
    premiumUsers: {
      today: { value: 45, change: "+5%" },
      weekly: { value: 320, change: "+12%" },
      monthly: { value: 1100, change: "+18%" },
      total: { value: 5230, change: null },
    },
    wribates: {
      today: { value: 156, change: "+8%" },
      weekly: { value: 980, change: "+22%" },
      monthly: { value: 4200, change: "+17%" },
      total: { value: 18750, change: null },
    },
    featuredWribates: {
      today: { value: 24, change: "+33%" },
      weekly: { value: 125, change: "+10%" },
      monthly: { value: 480, change: "+25%" },
      total: { value: 2340, change: null },
    },
    adViews: {
      today: { value: 5600, change: "+42%" },
      weekly: { value: 32500, change: "+28%" },
      monthly: { value: 145000, change: "+35%" },
      total: { value: 1250000, change: null },
    },
    wribateAmount: {
      today: { value: "$1,240", change: "+15%" },
      weekly: { value: "$8,650", change: "+23%" },
      monthly: { value: "$36,400", change: "+31%" },
      total: { value: "$175,800", change: null },
    },
  });

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
          <div key={period} className="text-center font-semibold text-lg">
            {period}
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
                {data.change && (
                  <div className="text-sm font-medium">
                    {data.change} than yesterday
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
