"use client";

import { Toaster } from "sonner";
import type { ReactNode } from "react";

// No SessionProvider: this app never calls useSession() client-side — every auth check goes
// through the server-side auth() helper (in layouts, route handlers, and server actions). Adding
// SessionProvider anyway causes an unnecessary background /api/auth/session poll on every page,
// which can race with signOut()'s cookie-clearing and silently re-establish a "logged out"
// session (found via a flaky logout e2e test — see tests/e2e/logout.spec.ts).
export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
