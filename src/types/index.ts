import type { Prisma } from "@prisma/client";

export type TaskWithCategory = Prisma.TaskGetPayload<{ include: { category: true } }>;
export type CategoryWithCount = Prisma.CategoryGetPayload<{ include: { _count: { select: { tasks: true } } } }>;
