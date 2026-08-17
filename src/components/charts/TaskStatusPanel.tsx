import { ClipboardCheck } from "lucide-react";
import { DonutChart } from "./DonutChart";
import type { getTaskStatusCounts } from "@/lib/tasks";

export function TaskStatusPanel({ counts }: { counts: Awaited<ReturnType<typeof getTaskStatusCounts>> }) {
  return (
    <section className="rounded-2xl bg-panel p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-coral-600">
        <ClipboardCheck size={16} />
        Task Status
      </div>
      <div className="flex justify-between gap-2">
        <DonutChart percentage={counts.percentages.completed} color="var(--color-status-green)" label="Completed" />
        <DonutChart percentage={counts.percentages.inProgress} color="var(--color-status-blue)" label="In Progress" />
        <DonutChart percentage={counts.percentages.notStarted} color="var(--color-status-red)" label="Not Started" />
      </div>
    </section>
  );
}
