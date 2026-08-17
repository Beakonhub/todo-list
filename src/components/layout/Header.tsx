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
  const [primary, ...rest] = title.split(" ");

  return (
    <header className="flex items-center gap-6 border-b border-black/5 bg-panel px-8 py-4">
      <h1 className="shrink-0 text-xl font-bold">
        <span className="text-coral-500">{primary}</span>{rest.length ? ` ${rest.join(" ")}` : ""}
      </h1>

      <form
        className="mx-auto flex w-full max-w-md items-center gap-2 rounded-full bg-panel-muted px-4 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(query ? `/my-task?q=${encodeURIComponent(query)}` : "/my-task");
        }}
      >
        <Search size={16} className="text-foreground/40" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your task here..."
          aria-label="Search tasks"
          className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
        />
      </form>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-full bg-panel-muted p-2 text-foreground/60 hover:bg-coral-50"
        >
          <Bell size={18} />
        </button>
        <button
          type="button"
          aria-label="Calendar"
          className="rounded-full bg-panel-muted p-2 text-foreground/60 hover:bg-coral-50"
        >
          <CalendarDays size={18} />
        </button>
        <div className="text-right text-sm leading-tight">
          <div className="font-medium">{format(new Date(), "EEEE")}</div>
          <div className="text-coral-500">{format(new Date(), "dd/MM/yyyy")}</div>
        </div>
      </div>
    </header>
  );
}
