import { prisma } from "@/lib/prisma";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/lib/validations/category";

export async function listCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { tasks: true } } },
  });
}

export async function createCategory(userId: string, input: CreateCategoryInput) {
  const existing = await prisma.category.findUnique({
    where: { userId_name: { userId, name: input.name } },
  });
  if (existing) return { error: "duplicate" as const };

  const category = await prisma.category.create({
    data: { name: input.name, color: input.color, userId },
  });
  return { category };
}

export async function updateCategory(userId: string, id: string, input: UpdateCategoryInput) {
  const existing = await prisma.category.findFirst({ where: { id, userId } });
  if (!existing) return null;
  return prisma.category.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.color !== undefined && { color: input.color }),
    },
  });
}

export async function deleteCategory(userId: string, id: string) {
  const existing = await prisma.category.findFirst({ where: { id, userId } });
  if (!existing) return false;
  await prisma.category.delete({ where: { id } });
  return true;
}
