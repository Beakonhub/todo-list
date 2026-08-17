import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "sundar@example.com" },
    update: {},
    create: {
      name: "Sundar Gurung",
      email: "sundar@example.com",
      passwordHash,
    },
  });

  const category = await prisma.category.upsert({
    where: { userId_name: { userId: user.id, name: "Work" } },
    update: {},
    create: { name: "Work", color: "#EE6B5C", userId: user.id },
  });

  const existingTasks = await prisma.task.count({ where: { ownerId: user.id } });
  if (existingTasks === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: "Attend Nischal's Birthday Party",
          description: "Buy gifts on the way and pick up cake from the bakery.",
          priority: "MODERATE",
          status: "NOT_STARTED",
          isVital: true,
          ownerId: user.id,
          categoryId: category.id,
        },
        {
          title: "Landing Page Design for TravelDays",
          description: "Get the work done by EOD and discuss with client before leaving.",
          priority: "MODERATE",
          status: "IN_PROGRESS",
          ownerId: user.id,
          categoryId: category.id,
        },
        {
          title: "Presentation on Final Product",
          description: "Make sure everything is functioning and ready for the demo.",
          priority: "HIGH",
          status: "IN_PROGRESS",
          ownerId: user.id,
        },
        {
          title: "Walk the dog",
          description: "Take the dog to the park and bring treats as well.",
          priority: "LOW",
          status: "COMPLETED",
          completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          ownerId: user.id,
        },
        {
          title: "Conduct meeting",
          description: "Meet with the client and finalize requirements.",
          priority: "MODERATE",
          status: "COMPLETED",
          completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          ownerId: user.id,
        },
      ],
    });
  }

  console.log(`Seeded user ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
