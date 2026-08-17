"use client";

import Image from "next/image";
import { format } from "date-fns";
import { MoreVertical, Pencil, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import type { TaskWithCategory } from "@/types";
import { cn, titleCase } from "@/lib/utils";

const statusRingColor: Record<TaskWithCategory["status"], string> = {
  NOT_STARTED: "border-status-red",
  IN_PROGRESS: "border-status-blue",
  COMPLETED: "border-status-green",
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
    <article className="rounded-2xl border border-black/5 bg-panel p-4 shadow-sm" data-testid="task-card">
      <div className="flex items-start gap-3">
        <span className={cn("mt-1.5 h-3 w-3 shrink-0 rounded-full border-2", statusRingColor[task.status])} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-semibold leading-snug">{task.title}</h3>
            <div className="relative flex shrink-0 items-center gap-1">
              {onToggleVital && (
                <button
                  type="button"
                  aria-label="Toggle vital"
                  onClick={() => onToggleVital(task)}
                  className="rounded p-1 hover:bg-black/5"
                >
                  <Star size={16} className={task.isVital ? "fill-coral-500 text-coral-500" : "text-foreground/40"} />
                </button>
              )}
              {(onEdit || onDelete) && (
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Task actions"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="rounded p-1 hover:bg-black/5"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 z-10 mt-1 w-32 rounded-lg border border-black/10 bg-white py-1 shadow-lg">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            onEdit(task);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-coral-50"
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
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-status-red hover:bg-red-50"
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
            <p className="mt-1 line-clamp-2 text-sm text-foreground/60">{task.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/50">
            <span>Priority: {titleCase(task.priority)}</span>
            <span>Status: {titleCase(task.status)}</span>
            <span>Created on: {format(new Date(task.createdAt), "dd/MM/yyyy")}</span>
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
