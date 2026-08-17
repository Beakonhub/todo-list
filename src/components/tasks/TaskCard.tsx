"use client";

import Image from "next/image";
import { format } from "date-fns";
import { MoreVertical, Pencil, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import type { TaskWithCategory } from "@/types";
import { cn, titleCase } from "@/lib/utils";

const statusTabColor: Record<TaskWithCategory["status"], string> = {
  NOT_STARTED: "bg-brick-500",
  IN_PROGRESS: "bg-amber-500",
  COMPLETED: "bg-teal-500",
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleVital,
}: {
  task: TaskWithCategory;
  onEdit?: (task: TaskWithCategory) => void;
  onDelete?: (task: TaskWithCategory) => void;
  onToggleVital?: (task: TaskWithCategory) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article
      className="flex overflow-hidden rounded border border-board-line bg-strip shadow-[0_1px_0_rgba(0,0,0,0.3)]"
      data-testid="task-card"
    >
      <span className={cn("w-1.5 shrink-0", statusTabColor[task.status])} aria-hidden />
      <div className="flex flex-1 items-start gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-display font-semibold leading-snug text-ink">{task.title}</h3>
            <div className="relative flex shrink-0 items-center gap-1">
              {onToggleVital && (
                <button
                  type="button"
                  aria-label="Toggle vital"
                  onClick={() => onToggleVital(task)}
                  className="rounded p-1 hover:bg-ink/5"
                >
                  <Star size={16} className={task.isVital ? "fill-brick-500 text-brick-500" : "text-ink/30"} />
                </button>
              )}
              {(onEdit || onDelete) && (
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Task actions"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="rounded p-1 text-ink/60 hover:bg-ink/5"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 z-10 mt-1 w-32 rounded border border-board-line bg-board-raised py-1 shadow-lg">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            onEdit(task);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-strip hover:bg-board"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            onDelete(task);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-brick-500 hover:bg-board"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{task.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            <span>Priority: {titleCase(task.priority)}</span>
            <span>Status: {titleCase(task.status)}</span>
            <span>Created: {format(new Date(task.createdAt), "dd/MM/yy")}</span>
          </div>
        </div>
        {task.imageUrl && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-strip-muted">
            <Image src={task.imageUrl} alt="" fill sizes="64px" className="object-cover" unoptimized />
          </div>
        )}
      </div>
    </article>
  );
}
