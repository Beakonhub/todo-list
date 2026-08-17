import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createTask, listTasks } from "@/lib/tasks";
import { createTaskSchema, taskFiltersSchema } from "@/lib/validations/task";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const rawFilters = Object.fromEntries(url.searchParams.entries());
  const parsed = taskFiltersSchema.safeParse(rawFilters);
  if (!parsed.success) return NextResponse.json({ error: "Invalid filters" }, { status: 400 });

  const tasks = await listTasks(session.user.id, parsed.data);
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const task = await createTask(session.user.id, parsed.data);
  return NextResponse.json(task, { status: 201 });
}
