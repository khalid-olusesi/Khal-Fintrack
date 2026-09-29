"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dateOptions = [
  { label: "Today", value: "Today" },
  { label: "This Week", value: "This Week" },
  { label: "This Month", value: "This Month" },
  { label: "Last Month", value: "Last Month" },
  { label: "Last 3 Months", value: "Last 3 Months" },
  { label: "This Year", value: "This Year" },
];
type DateFilterProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function DateFilter({ value, onValueChange }: DateFilterProps) {
  return (
    <Select
      value={value}
      onValueChange={(newValue) => {
        onValueChange(newValue ?? "This Month");
      }}
    >
      <SelectTrigger className="w-full max-w-48 bg-white dark:bg-card cursor-pointer">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Date</SelectLabel>

          {dateOptions.map((date) => (
            <SelectItem key={date.value} value={date.value}>
              {date.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
