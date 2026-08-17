import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import type { TaskWithCategory } from "@/types";

export function CompletedTaskCard({ task }: { task: TaskWithCategory }) {
  return (
    <article
      className="relative flex overflow-hidden rounded border border-board-line bg-strip shadow-[0_1px_0_rgba(0,0,0,0.3)]"
      data-testid="completed-task-card"
    >
      <span className="w-1.5 shrink-0 bg-teal-500" aria-hidden />
      <div className="flex flex-1 items-start gap-3 p-4">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 font-display font-semibold leading-snug text-ink">{task.title}</h3>
          {task.description && (
            <p className="mt-1 line-clamp-1 text-sm text-ink-soft">{task.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            <span>Status: Completed</span>
            {task.completedAt && (
              <span>Completed {formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })}</span>
            )}
          </div>
        </div>
        {task.imageUrl && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-strip-muted">
            <Image src={task.imageUrl} alt="" fill sizes="64px" className="object-cover" unoptimized />
          </div>
        )}
      </div>
      <div
        className="stamp-mark pointer-events-none absolute right-3 top-3 select-none rounded-sm border-2 border-teal-600 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-teal-600"
        style={{ transform: "rotate(-9deg)" }}
        aria-hidden
      >
        Cleared
      </div>
    </article>
  );
}
