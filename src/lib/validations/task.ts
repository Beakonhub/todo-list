import { z } from "zod";

export const priorityEnum = z.enum(["LOW", "MODERATE", "HIGH"]);
export const taskStatusEnum = z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]);

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  priority: priorityEnum.default("MODERATE"),
  status: taskStatusEnum.default("NOT_STARTED"),
  isVital: z.boolean().default(false),
  dueDate: z.coerce.date().optional().nullable(),
  categoryId: z.string().cuid().optional().nullable(),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const taskFiltersSchema = z.object({
  status: taskStatusEnum.optional(),
  categoryId: z.string().cuid().optional(),
  isVital: z.coerce.boolean().optional(),
  q: z.string().optional(),
});
export type TaskFilters = z.infer<typeof taskFiltersSchema>;
