import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listInvites } from "@/lib/invites";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { InvitesList } from "@/components/settings/InvitesList";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [user, invites] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { name: true, email: true, image: true },
    }),
    listInvites(userId),
  ]);

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Profile</h2>
        <ProfileForm user={user} />
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold">Sent invites</h2>
        <div className="rounded-2xl bg-panel p-6 shadow-sm">
          <InvitesList invites={invites} />
        </div>
      </div>
    </div>
  );
}
