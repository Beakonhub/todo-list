import { ClipboardList, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTaskStatusCounts } from "@/lib/tasks";
import { listCategories } from "@/lib/categories";
import { listCollaborators } from "@/lib/invites";
import { WelcomeBanner } from "@/components/layout/WelcomeBanner";
import { TaskStatusPanel } from "@/components/charts/TaskStatusPanel";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { CompletedTaskCard } from "@/components/tasks/CompletedTaskCard";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [todoTasks, completedTasks, counts, categories, collaborators] = await Promise.all([
    prisma.task.findMany({
      where: { ownerId: userId, status: { not: "COMPLETED" } },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { category: true },
    }),
    prisma.task.findMany({
      where: { ownerId: userId, status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
      take: 5,
      include: { category: true },
    }),
    getTaskStatusCounts(userId),
    listCategories(userId),
    listCollaborators(userId),
  ]);

  return (
    <div>
      <WelcomeBanner name={session!.user.name} collaborators={collaborators} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-wide text-strip/70">
              <ClipboardList size={15} />
              To-Do
            </div>
            <span className="font-mono text-xs uppercase tracking-wide text-strip/40">
              {format(new Date(), "d MMMM")} &middot; Today
            </span>
          </div>
          <TaskBoard tasks={todoTasks} categories={categories} emptyMessage="Nothing to do — add a task to get started." />
        </section>

        <div className="space-y-6">
          <TaskStatusPanel counts={counts} />

          <section className="rounded border border-board-line bg-board-raised p-5">
            <div className="mb-4 flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-wide text-strip/70">
              <CheckCircle2 size={15} />
              Completed Task
            </div>
            {completedTasks.length === 0 ? (
              <p className="text-sm text-strip/40">No completed tasks yet.</p>
            ) : (
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <CompletedTaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
