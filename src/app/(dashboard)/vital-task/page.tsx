import { auth } from "@/lib/auth";
import { listTasks } from "@/lib/tasks";
import { listCategories } from "@/lib/categories";
import { TaskBoard } from "@/components/tasks/TaskBoard";

export default async function VitalTaskPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [tasks, categories] = await Promise.all([
    listTasks(userId, { isVital: true }),
    listCategories(userId),
  ]);

  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-semibold text-strip">Vital Tasks</h2>
      <TaskBoard
        tasks={tasks}
        categories={categories}
        showAddButton={false}
        emptyMessage="No vital tasks yet — star a task from My Task to pin it here."
      />
    </div>
  );
}
