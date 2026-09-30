"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/currency";
import { useCurrency } from "@/context/currency-context";

interface PeriodTotals {
  period: string;
  income: number;
  expenses: number;
}

export default function IncomeExpensesChart({
  data,
  hideTitle = false,
}: {
  data: PeriodTotals[];
  hideTitle?: boolean;
}) {
  const { currency } = useCurrency();
  const chart = (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="period"
          axisLine={false}
          tickLine={false}
          fontSize={12}
        />
        <YAxis
          width={115}
          axisLine={false}
          tickLine={false}
          fontSize={12}
          tickFormatter={(value) => formatCurrency(Number(value), currency)}
        />
        <Tooltip
          cursor={false}
          formatter={(value, name) => [
            formatCurrency(Number(value), currency),
            name,
          ]}
        />
        <Bar
          dataKey="income"
          name="Income"
          fill="#16a34a"
          radius={[4, 4, 0, 0]}
          barSize={24}
        />
        <Bar
          dataKey="expenses"
          name="Expenses"
          fill="#e11d48"
          radius={[4, 4, 0, 0]}
          barSize={24}
        />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );

  if (hideTitle) return chart;

  return (
    <div className="bg-white dark:bg-card shadow-sm rounded-2xl border border-border p-4 md:p-6 flex-1">
      <h2 className="font-semibold mb-4">Income vs Expenses</h2>
      {chart}
    </div>
  );
}
