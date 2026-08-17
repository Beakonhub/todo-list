"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { initials } from "@/lib/utils";

type Collaborator = { id: string; user: { id: string; name: string | null; email: string; image: string | null } };

export function WelcomeBanner({
  name,
  collaborators,
}: {
  name?: string | null;
  collaborators: Collaborator[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const firstName = name?.split(" ")[0] ?? "there";

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitting(false);
    if (!res.ok) {
      toast.error("Failed to send invite");
      return;
    }
    toast.success("Invite sent");
    setEmail("");
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="font-display text-2xl font-semibold text-strip">
        Welcome back, {firstName} <span aria-hidden>👋</span>
      </h2>
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {collaborators.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="relative h-9 w-9 overflow-hidden rounded border-2 border-board bg-board-raised"
              title={c.user.name ?? c.user.email}
            >
              {c.user.image ? (
                <Image src={c.user.image} alt="" fill sizes="36px" className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-mono text-xs font-semibold text-teal-500">
                  {initials(c.user.name ?? c.user.email)}
                </div>
              )}
            </div>
          ))}
        </div>
        <Button onClick={() => setOpen(true)}>
          <UserPlus size={16} /> Invite
        </Button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Invite a collaborator">
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@example.com"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              Send invite
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
