import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { useCategories } from "@/context/category-context";
import { useState, useEffect } from "react";

type CategoryDropDownProps = {
  value?: string;
  onValueChange?: (value: string | null) => void;
  type?: "income" | "expense" | "all";
};

export default function CategoryDropDown({
  value,
  onValueChange,
  type = "all",
}: CategoryDropDownProps) {
  const { categories } = useCategories();

  // Track the selected value internally for uncontrolled usage
  const [internalValue, setInternalValue] = useState(value ?? "");

  // Sync internal state when the controlled value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const incomes = categories.filter((category) => category.type === "income");
  const expenses = categories.filter((category) => category.type === "expense");

  // Resolve the selected value to a display name
  const getDisplayName = (val: string) => {
    if (!val || val === "all") return "All Categories";
    return (
      categories.find((category) => String(category.id) === val)?.name ?? "All Categories"
    );
  };

  const handleValueChange = (newValue: string | null) => {
    setInternalValue(newValue ?? "");
    onValueChange?.(newValue);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className=" border-gray-200 border-2">
        <SelectValue placeholder="All Categories">
          {getDisplayName(internalValue)}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="w-full">
        {type === "all" && (
          <>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectSeparator />
          </>
        )}
        {(type === "all" || type === "income") && (
          <SelectGroup>
            <SelectLabel>Income</SelectLabel>

            {incomes.map((income) => (
              <SelectItem key={income.id} value={String(income.id)}>
                {income.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}

        {type === "all" && <SelectSeparator />}

        {(type === "all" || type === "expense") && (
          <SelectGroup>
            <SelectLabel>Expense</SelectLabel>

            {expenses.map((expense) => (
              <SelectItem key={expense.id} value={String(expense.id)}>
                {expense.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}
