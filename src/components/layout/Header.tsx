"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, CalendarDays, Search } from "lucide-react";
import { format } from "date-fns";

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/vital-task": "Vital Task",
  "/my-task": "My Task",
  "/task-categories": "Task Categories",
  "/settings": "Settings",
  "/help": "Help",
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const title = routeTitles[pathname] ?? "Dashboard";

  return (
    <header className="flex items-center gap-6 border-b border-board-line bg-board-raised px-8 py-4">
      <h1 className="shrink-0 font-display text-lg font-semibold uppercase tracking-wide text-strip">
        {title}
      </h1>

      <form
        className="mx-auto flex w-full max-w-md items-center gap-2 rounded border border-board-line bg-strip px-4 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(query ? `/my-task?q=${encodeURIComponent(query)}` : "/my-task");
        }}
      >
        <Search size={16} className="text-ink-soft" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your task here..."
          aria-label="Search tasks"
          className="w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink-soft"
        />
      </form>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="rounded border border-board-line p-2 text-strip/60 hover:border-teal-500/50 hover:text-strip"
        >
          <Bell size={17} />
        </button>
        <button
          type="button"
          aria-label="Calendar"
          className="rounded border border-board-line p-2 text-strip/60 hover:border-teal-500/50 hover:text-strip"
        >
          <CalendarDays size={17} />
        </button>
        <div className="rounded border border-board-line px-3 py-1.5 text-right font-mono text-xs leading-tight text-strip/70">
          <div className="uppercase tracking-wide">{format(new Date(), "EEEE")}</div>
          <div className="text-teal-500">{format(new Date(), "dd/MM/yyyy")}</div>
        </div>
      </div>
    </header>
  );
}
