"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth-client";
import {
  LayoutDashboard,
  Star,
  CheckSquare,
  Tags,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vital-task", label: "Vital Task", icon: Star },
  { href: "/my-task", label: "My Task", icon: CheckSquare },
  { href: "/task-categories", label: "Task Categories", icon: Tags },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
  { href: "/help", label: "Help", icon: HelpCircle },
];

export function Sidebar({ user }: { user: { name?: string | null; email?: string | null; image?: string | null } }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-board-line bg-board-raised px-4 py-6">
      <div className="mb-8 flex flex-col items-center border-b border-board-line pb-6 text-center">
        <div className="relative mb-3 h-14 w-14 overflow-hidden rounded border-2 border-teal-500/50 bg-board">
          {user.image ? (
            <Image src={user.image} alt="" fill sizes="56px" className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-base font-semibold text-teal-500">
              {initials(user.name)}
            </div>
          )}
        </div>
        <p className="font-display font-semibold text-strip">{user.name ?? "User"}</p>
        <p className="font-mono text-[11px] text-strip/40">{user.email}</p>
      </div>

      <nav className="flex-1 space-y-0.5" aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              className={cn(
                "relative flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-board text-strip" : "text-strip/60 hover:bg-board hover:text-strip"
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full transition-colors",
                  active ? "bg-teal-500" : "bg-transparent"
                )}
                aria-hidden
              />
              <Icon size={17} strokeWidth={active ? 2.25 : 1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => logout()}
        className="mt-auto flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-brick-500/80 transition-colors hover:bg-brick-500/10 hover:text-brick-500"
      >
        <LogOut size={17} strokeWidth={1.75} />
        Logout
      </button>
    </aside>
  );
}
