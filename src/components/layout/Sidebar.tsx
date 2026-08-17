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
    <aside className="flex h-full w-64 shrink-0 flex-col bg-coral-500 px-4 py-6 text-white">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full bg-white/20">
          {user.image ? (
            <Image src={user.image} alt="" fill sizes="64px" className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold">
              {initials(user.name)}
            </div>
          )}
        </div>
        <p className="font-semibold">{user.name ?? "User"}</p>
        <p className="text-xs text-white/70">{user.email}</p>
      </div>

      <nav className="flex-1 space-y-1" aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-white text-coral-600" : "text-white/90 hover:bg-white/15"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => logout()}
        className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/15"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
