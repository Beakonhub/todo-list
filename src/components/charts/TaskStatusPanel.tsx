import { ClipboardCheck } from "lucide-react";
import { DonutChart } from "./DonutChart";
import type { getTaskStatusCounts } from "@/lib/tasks";

export function TaskStatusPanel({ counts }: { counts: Awaited<ReturnType<typeof getTaskStatusCounts>> }) {
  return (
    <section className="rounded border border-board-line bg-board-raised p-5">
      <div className="mb-4 flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-wide text-strip/70">
        <ClipboardCheck size={15} />
        Task Status
      </div>
      <div className="flex justify-between gap-2">
        <DonutChart percentage={counts.percentages.completed} color="var(--color-teal-500)" label="Completed" />
        <DonutChart percentage={counts.percentages.inProgress} color="var(--color-amber-500)" label="In Progress" />
        <DonutChart percentage={counts.percentages.notStarted} color="var(--color-brick-500)" label="Not Started" />
      </div>
    </section>
  );
}
