"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WeeklyTotal {
  week: string;
  total: number;
}

export default function ExpensesOverviewChart({
  data,
  hideTitle = false,
}: {
  data: WeeklyTotal[];
  hideTitle?: boolean;
}) {
  const chart = (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="week" axisLine={false} tickLine={false} fontSize={12} />
        <YAxis
          axisLine={false}
          tickLine={false}
          fontSize={12}
          tickFormatter={(v) => `₦${v.toLocaleString()}`}
        />
        <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, "Spent"]} />
        <Bar
          dataKey="total"
          fill="#22c55e"
          radius={[4, 4, 0, 0]}
          barSize={36}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  if (hideTitle) return chart;

  return (
    <div className="bg-white dark:bg-card shadow-sm rounded-2xl border border-border p-4 md:p-6 flex-1">
      <h2 className="font-semibold mb-4">Expenses Overview</h2>
      {chart}
    </div>
  );
}
