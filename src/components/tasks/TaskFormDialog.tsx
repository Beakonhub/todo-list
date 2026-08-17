"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import type { CategoryWithCount, TaskWithCategory } from "@/types";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  priority: z.enum(["LOW", "MODERATE", "HIGH"]),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
  isVital: z.boolean(),
  dueDate: z.string().optional(),
  categoryId: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function TaskFormDialog({
  open,
  onClose,
  onSubmit,
  categories,
  initialTask,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  categories: CategoryWithCount[];
  initialTask?: TaskWithCategory | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      priority: "MODERATE",
      status: "NOT_STARTED",
      isVital: false,
      dueDate: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      title: initialTask?.title ?? "",
      description: initialTask?.description ?? "",
      imageUrl: initialTask?.imageUrl ?? "",
      priority: initialTask?.priority ?? "MODERATE",
      status: initialTask?.status ?? "NOT_STARTED",
      isVital: initialTask?.isVital ?? false,
      dueDate: initialTask?.dueDate ? initialTask.dueDate.toString().slice(0, 10) : "",
      categoryId: initialTask?.categoryId ?? "",
    });
  }, [open, initialTask, reset]);

  return (
    <Dialog open={open} onClose={onClose} title={initialTask ? "Edit task" : "Add task"}>
      <form
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
          onClose();
        })}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="task-title">Title</Label>
          <Input id="task-title" {...register("title")} placeholder="e.g. Attend Nischal's Birthday Party" />
          {errors.title && <p className="mt-1 text-xs text-status-red">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="task-description">Description</Label>
          <Textarea id="task-description" {...register("description")} placeholder="Short description..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="task-priority">Priority</Label>
            <Select id="task-priority" {...register("priority")}>
              <option value="LOW">Low</option>
              <option value="MODERATE">Moderate</option>
              <option value="HIGH">High</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="task-status">Status</Label>
            <Select id="task-status" {...register("status")}>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="task-due-date">Due date</Label>
            <Input id="task-due-date" type="date" {...register("dueDate")} />
          </div>
          <div>
            <Label htmlFor="task-category">Category</Label>
            <Select id="task-category" {...register("categoryId")}>
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="task-image-url">Image URL</Label>
          <Input id="task-image-url" {...register("imageUrl")} placeholder="https://..." />
          {errors.imageUrl && <p className="mt-1 text-xs text-status-red">{errors.imageUrl.message}</p>}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isVital")} className="h-4 w-4 rounded" />
          Mark as vital
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {initialTask ? "Save changes" : "Add task"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
