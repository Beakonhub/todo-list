import { auth } from "@/lib/auth";
import { listCategories } from "@/lib/categories";
import { CategoryBoard } from "@/components/categories/CategoryBoard";

export default async function TaskCategoriesPage() {
  const session = await auth();
  const categories = await listCategories(session!.user.id);

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Task Categories</h2>
      <CategoryBoard categories={categories} />
    </div>
  );
}
