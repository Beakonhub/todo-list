"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { titleCase } from "@/lib/utils";
import type { Invite } from "@prisma/client";

export function InvitesList({ invites }: { invites: Invite[] }) {
  const router = useRouter();

  async function handleRevoke(id: string) {
    const res = await fetch(`/api/invites/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REVOKED" }),
    });
    if (!res.ok) {
      toast.error("Failed to revoke invite");
      return;
    }
    toast.success("Invite revoked");
    router.refresh();
  }

  if (invites.length === 0) {
    return <p className="text-sm text-foreground/50">No invites sent yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {invites.map((invite) => (
        <li key={invite.id} className="flex items-center justify-between rounded border border-board-line bg-board px-4 py-2.5 text-sm">
          <div>
            <p className="font-medium text-strip">{invite.email}</p>
            <p className="font-mono text-[11px] uppercase tracking-wide text-strip/40">{titleCase(invite.status)}</p>
          </div>
          {invite.status === "PENDING" && (
            <button
              type="button"
              onClick={() => handleRevoke(invite.id)}
              className="font-mono text-xs font-medium uppercase tracking-wide text-brick-500 hover:underline"
            >
              Revoke
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
