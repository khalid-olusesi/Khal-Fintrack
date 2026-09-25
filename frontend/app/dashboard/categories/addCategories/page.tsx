"use client";

import { toast } from "@/components/ui/toast";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/category-icons";
import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Tag, List } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";

type Category = {
  id: number;
  name: string;
  type: string;
  icon: string;
  color: string;
};

type CardSpacingProps = {
  onClose: () => void;
  selectedCategory: Category | null;
  isEditing: boolean;
  onSuccess: () => Promise<void>;
};

export default function CardSpacing({
  onClose,
  selectedCategory,
  isEditing,
  onSuccess,
}: CardSpacingProps) {
  const [form, setForm] = useState({
    name: selectedCategory?.name ?? "",
    icon: selectedCategory?.icon ?? "",
    type: selectedCategory?.type ?? "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    setForm({
      name: "",
      icon: "",
      type: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.add({ title: "Category name is required", type: "warning" });
      return;
    }

    if (!form.icon) {
      toast.add({ title: "Pick an icon", type: "warning" });
      return;
    }

    if (!form.type) {
      toast.add({ title: "Choose a type (income or expense)", type: "warning" });
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");

      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${selectedCategory?.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/categories`;

      const method = isEditing ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Type: form.type,
          Name: form.name,
          Icon: form.icon,
        }),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!response.ok) {
        toast.add({ title: data?.error || text || "Something went wrong", type: "error" });
        return;
      }

      if (isEditing) {
        toast.add({ title: "Category updated successfully", type: "success" });
      } else {
        toast.add({ title: "A new category created", type: "success" });
      }

      onClose();
      onSuccess(); // refetch in background, no await

      setForm({
        type: "",
        name: "",
        icon: "",
      });
    } catch (err) {
      console.error(err);
      toast.add({ title: "Unable to connect to the server.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto h95 grid w-full max-w-2xl gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="mt-3">Add Category</CardTitle>
          <CardAction>
            <Button
              type="button"
              onClick={onClose}
              className="cursor-pointer"
              variant="link"
            >
              <X />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="texts-spacing"
                  className="text-muted-foreground"
                >
                  Category Name
                </Label>
                <div className="flex w-full">
                  <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border border-r-0 border-gray-200 dark:border-border rounded-l-md text-muted-foreground">
                    <Tag className="w-4 h-4" />
                  </div>
                  <Input
                    id="texts-spacing"
                    type="text"
                    placeholder="e.g Groceries"
                    required
                    value={form.name}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        name: e.target.value,
                      });
                    }}
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="texts-spacing"
                    className="text-muted-foreground"
                  >
                    Type
                  </Label>
                </div>
                <div className="flex w-full">
                  <div className="flex items-center justify-center w-11 bg-gray-50 dark:bg-zinc-800/50 border border-r-0 border-gray-200 dark:border-border rounded-l-md text-muted-foreground">
                    <List className="w-4 h-4" />
                  </div>
                  <Select
                    value={form.type}
                    onValueChange={(value) => {
                      setForm({
                        ...form,
                        type: value ?? "",
                      });
                    }}
                  >
                    <SelectTrigger className="w-full max-w-full rounded-l-none">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Type</SelectLabel>

                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-muted-foreground text-sm">Icon</p>
              <div className="flex items-center justify-between">
                {Icons.map(
                  ({ name, icon: Icon, textColor, hoverBg, selectedBg }) => (
                    <div
                      className={`border-2 rounded-lg cursor-pointer p-3  ${textColor} ${hoverBg}  ${form.icon === name ? selectedBg : ""} `}
                      key={name}
                      onClick={() => {
                        setForm({
                          ...form,
                          icon: name,
                        });
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-none mt-7 bg-none">
              <Button
                type="submit"
                className="cursor-pointer bg-0 border-xl text-black hover:opacity-100 hover:text-white"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer" disabled={isSaving}>
                {isSaving ? "Saving..." : isEditing ? "Update Category" : "Add Category"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
