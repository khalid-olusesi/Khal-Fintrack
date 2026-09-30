"use client";

import { formatCurrency } from "@/lib/currency";
import { useCurrency } from "@/context/currency-context";

type SpendingCategory = {
  id: number;
  name: string;
  icon: string;
  color: string;
  spent: number;
  percentage: number;
};

const FALLBACK_COLORS = [
  "#E63946", // red
  "#2A9D8F", // teal
  "#E9C46A", // yellow
  "#264653", // dark blue
  "#F4A261", // orange
  "#9CA3AF", // gray (Others)
];

export default function TopSpendingCategories({
  categories,
  hideTitle = false,
}: {
  categories: SpendingCategory[];
  hideTitle?: boolean;
}) {
  const { currency } = useCurrency();
  const content =
    categories.length === 0 ? (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-muted-foreground">
          No category data for this period
        </p>
      </div>
    ) : (
      <div className="space-y-5">
        {categories.map((category, index) => {
          const barColor =
            category.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
          return (
            <div key={category.id}>
              {/* top row: indicator + name + amount + percentage */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-1.5 h-5 rounded-full shrink-0"
                  style={{ backgroundColor: barColor }}
                />
                <span className="text-sm font-medium flex-1 truncate">
                  {category.name}
                </span>
                <span className="text-sm font-semibold tabular-nums whitespace-nowrap">
                  {formatCurrency(category.spent, currency)}
                </span>
                <span className="text-sm text-muted-foreground w-10 text-right tabular-nums">
                  {Math.round(category.percentage)}%
                </span>
              </div>

              {/* full-width progress bar */}
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );

  if (hideTitle) return content;

  return (
    <div className="bg-white dark:bg-card shadow-sm rounded-2xl border border-border p-4 md:p-6 flex-1 h-full min-h-[420px]">
      <h2 className="font-semibold mb-6">Top Spending Categories</h2>
      {content}
    </div>
  );
}
