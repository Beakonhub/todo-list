export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: [
    "/",
    "/vital-task/:path*",
    "/my-task/:path*",
    "/task-categories/:path*",
    "/settings/:path*",
    "/help/:path*",
    "/api/tasks/:path*",
    "/api/categories/:path*",
    "/api/invites/:path*",
    "/api/users/:path*",
  ],
};
