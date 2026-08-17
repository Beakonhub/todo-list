"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { TaskFormDialog } from "./TaskFormDialog";
import type { CategoryWithCount, TaskWithCategory } from "@/types";

export function TaskBoard({
  tasks,
  categories,
  emptyMessage = "No tasks yet.",
  showAddButton = true,
}: {
  tasks: TaskWithCategory[];
  categories: CategoryWithCount[];
  emptyMessage?: string;
  showAddButton?: boolean;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithCategory | null>(null);

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleSubmit(values: {
    title: string;
    description?: string;
    imageUrl?: string;
    priority: "LOW" | "MODERATE" | "HIGH";
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    isVital: boolean;
    dueDate?: string;
    categoryId?: string;
  }) {
    const payload = {
      ...values,
      description: values.description || undefined,
      imageUrl: values.imageUrl || undefined,
      dueDate: values.dueDate || undefined,
      categoryId: values.categoryId || undefined,
    };
    const url = editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks";
    const method = editingTask ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      toast.error(editingTask ? "Failed to update task" : "Failed to create task");
      return;
    }
    toast.success(editingTask ? "Task updated" : "Task added");
    setEditingTask(null);
    refresh();
  }

  async function handleDelete(task: TaskWithCategory) {
    if (!confirm(`Delete "${task.title}"?`)) return;
    const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete task");
      return;
    }
    toast.success("Task deleted");
    refresh();
  }

  async function handleToggleVital(task: TaskWithCategory) {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVital: !task.isVital }),
    });
    if (!res.ok) {
      toast.error("Failed to update task");
      return;
    }
    refresh();
  }

  return (
    <>
      {showAddButton && (
        <div className="mb-3 flex justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              setEditingTask(null);
              setDialogOpen(true);
            }}
          >
            <Plus size={16} /> Add task
          </Button>
        </div>
      )}
      {tasks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/10 p-6 text-center text-sm text-foreground/50">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => {
                setEditingTask(t);
                setDialogOpen(true);
              }}
              onDelete={handleDelete}
              onToggleVital={handleToggleVital}
            />
          ))}
        </div>
      )}
      <TaskFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
        categories={categories}
        initialTask={editingTask}
      />
    </>
  );
}
