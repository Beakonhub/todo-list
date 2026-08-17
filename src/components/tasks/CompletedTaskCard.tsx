import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2 } from "lucide-react";
import type { TaskWithCategory } from "@/types";

export function CompletedTaskCard({ task }: { task: TaskWithCategory }) {
  return (
    <article className="rounded-2xl border border-black/5 bg-panel p-4 shadow-sm" data-testid="completed-task-card">
      <div className="flex items-start gap-3">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-status-green" />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 font-semibold leading-snug">{task.title}</h3>
          {task.description && (
            <p className="mt-1 line-clamp-1 text-sm text-foreground/60">{task.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/50">
            <span>Status: Completed</span>
            {task.completedAt && (
              <span>
                Completed {formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
        {task.imageUrl && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-panel-muted">
            <Image src={task.imageUrl} alt="" fill sizes="64px" className="object-cover" unoptimized />
          </div>
        )}
      </div>
    </article>
  );
}
