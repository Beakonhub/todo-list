import { auth } from "@/lib/auth";
import { listTasks } from "@/lib/tasks";
import { listCategories } from "@/lib/categories";
import { taskFiltersSchema } from "@/lib/validations/task";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { TaskFilters } from "@/components/tasks/TaskFilters";

export default async function MyTaskPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  const userId = session!.user.id;

  const rawParams = await searchParams;
  const filters = taskFiltersSchema.parse({
    status: rawParams.status,
    categoryId: rawParams.categoryId,
    q: rawParams.q,
  });

  const [tasks, categories] = await Promise.all([
    listTasks(userId, filters),
    listCategories(userId),
  ]);

  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-semibold text-strip">My Task</h2>
      <TaskFilters categories={categories} />
      <TaskBoard
        tasks={tasks}
        categories={categories}
        emptyMessage="No tasks match your filters."
      />
    </div>
  );
}
