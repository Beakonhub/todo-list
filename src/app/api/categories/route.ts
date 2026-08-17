import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCategory, listCategories } from "@/lib/categories";
import { createCategorySchema } from "@/lib/validations/category";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await listCategories(session.user.id);
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const result = await createCategory(session.user.id, parsed.data);
  if ("error" in result) return NextResponse.json({ error: "Category name already exists" }, { status: 409 });
  return NextResponse.json(result.category, { status: 201 });
}
