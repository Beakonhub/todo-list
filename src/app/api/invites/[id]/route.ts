import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { updateInviteStatus } from "@/lib/invites";

const patchSchema = z.object({ status: z.enum(["ACCEPTED", "DECLINED", "REVOKED"]) });

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const result = await updateInviteStatus(session.user.id, id, parsed.data.status);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if ("error" in result) return NextResponse.json({ error: "Invite is not pending" }, { status: 409 });
  return NextResponse.json(result.invite);
}
