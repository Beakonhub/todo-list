import { prisma } from "@/lib/prisma";

export async function listInvites(senderId: string) {
  return prisma.invite.findMany({ where: { senderId }, orderBy: { createdAt: "desc" } });
}

export async function createInvite(senderId: string, email: string) {
  return prisma.invite.create({ data: { senderId, email } });
}

export async function updateInviteStatus(
  senderId: string,
  id: string,
  status: "ACCEPTED" | "DECLINED" | "REVOKED"
) {
  const existing = await prisma.invite.findFirst({ where: { id, senderId } });
  if (!existing) return null;
  if (existing.status !== "PENDING") return { error: "not_pending" as const };

  const invite = await prisma.invite.update({
    where: { id },
    data: { status, respondedAt: new Date() },
  });

  if (status === "ACCEPTED") {
    const collaboratorUser = await prisma.user.findUnique({ where: { email: existing.email } });
    if (collaboratorUser) {
      await prisma.collaborator.upsert({
        where: { ownerId_userId: { ownerId: senderId, userId: collaboratorUser.id } },
        create: { ownerId: senderId, userId: collaboratorUser.id },
        update: {},
      });
    }
  }

  return { invite };
}

export async function listCollaborators(ownerId: string) {
  return prisma.collaborator.findMany({
    where: { ownerId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });
}
