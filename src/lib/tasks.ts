import { prisma } from "@/lib/prisma";
import type { CreateTaskInput, TaskFilters, UpdateTaskInput } from "@/lib/validations/task";
import type { Prisma } from "@prisma/client";
import { computeStatusPercentages, type StatusCounts } from "@/lib/task-stats";

export async function listTasks(ownerId: string, filters: TaskFilters = {}) {
  const where: Prisma.TaskWhereInput = { ownerId };
  if (filters.status) where.status = filters.status;
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.isVital !== undefined) where.isVital = filters.isVital;
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  return prisma.task.findMany({ where, orderBy: { createdAt: "desc" }, include: { category: true } });
}

export async function getTask(ownerId: string, id: string) {
  return prisma.task.findFirst({ where: { id, ownerId }, include: { category: true } });
}

export async function createTask(ownerId: string, input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description || null,
      imageUrl: input.imageUrl || null,
      priority: input.priority,
      status: input.status,
      isVital: input.isVital,
      dueDate: input.dueDate ?? null,
      categoryId: input.categoryId ?? null,
      ownerId,
      completedAt: input.status === "COMPLETED" ? new Date() : null,
    },
    include: { category: true },
  });
}

export async function updateTask(ownerId: string, id: string, input: UpdateTaskInput) {
  const existing = await prisma.task.findFirst({ where: { id, ownerId } });
  if (!existing) return null;

  let completedAt = existing.completedAt;
  if (input.status && input.status !== existing.status) {
    completedAt = input.status === "COMPLETED" ? new Date() : null;
  }

  return prisma.task.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description || null }),
      ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl || null }),
      ...(input.priority !== undefined && { priority: input.priority }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.isVital !== undefined && { isVital: input.isVital }),
      ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
      ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
      completedAt,
    },
    include: { category: true },
  });
}

export async function deleteTask(ownerId: string, id: string) {
  const existing = await prisma.task.findFirst({ where: { id, ownerId } });
  if (!existing) return false;
  await prisma.task.delete({ where: { id } });
  return true;
}

export async function getTaskStatusCounts(ownerId: string) {
  const grouped = await prisma.task.groupBy({
    by: ["status"],
    where: { ownerId },
    _count: { _all: true },
  });
  const counts: StatusCounts = { NOT_STARTED: 0, IN_PROGRESS: 0, COMPLETED: 0 };
  for (const row of grouped) counts[row.status] = row._count._all;
  const total = counts.NOT_STARTED + counts.IN_PROGRESS + counts.COMPLETED;
  return {
    ...counts,
    total,
    percentages: computeStatusPercentages(counts),
  };
}
