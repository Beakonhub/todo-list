import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { createInvite, listInvites } from "@/lib/invites";

const createInviteSchema = z.object({ email: z.string().email() });

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invites = await listInvites(session.user.id);
  return NextResponse.json(invites);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createInviteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const invite = await createInvite(session.user.id, parsed.data.email);
  return NextResponse.json(invite, { status: 201 });
}
