import { useState } from "react";
import { useGetDashboardQuery } from "../../app/services/authApi";
import { useEffect } from "react";

export default function Dashboard() {
  // Sample data for dashboard metrics

  const { data, isLoading, error } = useGetDashboardQuery({
    startDate: "2025-04-24",
    endDate: "2025-05-25",
  });

  const [metrics, setMetrics] = useState({
    users: {
      today: { value: "---", change: "---" },
      weekly: { value: "---", change: "---" },
      monthly: { value: "---", change: "---" },
      total: { value: "---" , change: null },
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
    wribateAmount:{
      today: { value: "---", change: "---" },
      weekly: { value: "---", change: "---" },
      monthly: { value: "---", change: "---" },
      total: { value: "---", change: null },
    }
  });

  useEffect(() => {
    if (data && data.status && data.status === "success") {
      // console.log("data", data.data);

      let activeUsers = 0 
      if (data.data.userStatusCounts) {
        activeUsers = data.data.userStatusCounts.find(
          users => users._id === 1
        )?.count || 0;
      }

      let totalWribates = 0
      if (data.data.writbateTypeCounts) {
        totalWribates += data.data.writbateTypeCounts.find(
          wribateType => wribateType._id === 'Free'
        )?.count || 0;
        totalWribates += data.data.writbateTypeCounts.find(
          wribateType => wribateType._id === 'Sonsored'
        )?.count || 0;
      }
      
      setMetrics({
        users: {
          today: { value: "---", change: "---" },
          weekly: { value: "---", change: "---" },
          monthly: { value: "---", change: "---" },
          total: { value: activeUsers , change: null },
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
          total: { value: totalWribates, change: null },
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
        wribateAmount:{
          today: { value: "---", change: "---" },
          weekly: { value: "---", change: "---" },
          monthly: { value: "---", change: "---" },
          total: { value: data.data.totalCompletedAmount, change: null },
        }
      });
    }
  }, [data]);
  if (isLoading) {
    return <div>Loading...</div>;
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
