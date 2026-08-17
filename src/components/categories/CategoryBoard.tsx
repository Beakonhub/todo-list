"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CategoryFormDialog } from "./CategoryFormDialog";
import type { CategoryWithCount } from "@/types";

export function CategoryBoard({ categories }: { categories: CategoryWithCount[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleCreate(values: { name: string; color: string }) {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to create category");
      return;
    }
    toast.success("Category created");
    refresh();
  }

  async function handleDelete(category: CategoryWithCount) {
    if (!confirm(`Delete "${category.name}"? Its tasks will become uncategorized.`)) return;
    const res = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete category");
      return;
    }
    toast.success("Category deleted");
    refresh();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} /> New category
        </Button>
      </div>
      {categories.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/10 p-6 text-center text-sm text-foreground/50">
          No categories yet. Create one to start organizing tasks.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-2xl bg-panel p-4 shadow-sm">
              <Link href={`/my-task?categoryId=${c.id}`} className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: c.color }} />
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-foreground/50">{c._count.tasks} task(s)</p>
                </div>
              </Link>
              <button
                type="button"
                aria-label={`Delete ${c.name}`}
                onClick={() => handleDelete(c)}
                className="rounded p-1.5 text-foreground/40 hover:bg-red-50 hover:text-status-red"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <CategoryFormDialog open={open} onClose={() => setOpen(false)} onSubmit={handleCreate} />
    </div>
  );
}
