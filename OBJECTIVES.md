# To-Do App — Build Objectives

Status legend: `[ ]` not started, `[~]` in progress, `[x]` done & verified, `[!]` blocked (see note).

Each item has an Acceptance Test — a concrete, scriptable check. Only mark `[x]` after actually
running that check this iteration, not because the code "looks right."

## 0. Foundation
- [x] 0.1 `npm run build` exits 0
- [x] 0.2 `npm run lint` exits 0 with no errors
- [x] 0.3 Prisma schema valid & migrations apply — `npx prisma migrate dev` / `migrate deploy` exit 0 against `DATABASE_URL` and `TEST_DATABASE_URL`
- [x] 0.4 Seed script populates demo data — `npm run db:seed` exits 0 and creates `sundar@example.com` with tasks across all three statuses

## 1. Auth
- [x] 1.1 Signup creates a real user — `POST /api/auth/signup` with a new email returns 201 and a `User` row exists with a bcrypt `passwordHash` (verified via e2e `auth.spec.ts`)
- [x] 1.2 Signup rejects duplicate email — second POST with same email returns 409 (verified via curl)
- [x] 1.3 Login works — signing in with correct credentials on `/login` redirects to `/` and shows the dashboard (verified via e2e + manual browser check)
- [x] 1.4 Wrong password rejected — login form shows "Invalid email or password." inline, no session created (verified via e2e `auth.spec.ts`)
- [x] 1.5 Protected routes redirect anonymous users — `GET /my-task` while logged out redirects to `/login` (verified via e2e)
- [x] 1.6 API is unauthenticated-safe — `GET /api/tasks` with no session cookie returns 401 (verified via curl)
- [x] 1.7 Logout clears session — clicking Logout in Sidebar ends the session and a subsequent `/my-task` request redirects to `/login` (verified via e2e `logout.spec.ts`, re-verified 10/10 stable runs after fixing a real race — see the "Major finding" note under section 9)

## 2. Dashboard
- [x] 2.1 Dashboard renders Sidebar with 6 nav items + Logout, active item highlighted for the current route (verified via manual browser screenshot)
- [x] 2.2 Header shows search bar, bell icon, calendar icon, and current date (verified via manual browser screenshot)
- [x] 2.3 Welcome banner shows "Welcome back, {firstName}" and collaborator avatars + Invite button (verified via manual browser screenshot)
- [x] 2.4 To-Do panel lists incomplete tasks as TaskCards with status dot, title, description, priority/status/created-on footer (verified via manual browser screenshot)
- [x] 2.5 Task Status panel renders 3 donut charts whose percentages are computed from live task counts; percentage math covered by unit tests (`tests/unit/task-stats.test.ts`)
- [x] 2.6 Completed Task panel lists completed tasks with green check icon and "Completed X ago" relative time (verified via e2e `dashboard.spec.ts`)

## 3. My Task (CRUD)
- [x] 3.1 Create task — submitting the Add Task dialog POSTs `/api/tasks`, new task appears in the list (verified via e2e `task-crud.spec.ts`)
- [x] 3.2 Edit task — updating a task's title persists via `PATCH /api/tasks/[id]` and is reflected in the UI (verified via e2e)
- [x] 3.3 Delete task — DELETE removes the task from the DB and UI (verified via e2e)
- [x] 3.4 Status change stamps `completedAt` — setting status to COMPLETED sets `completedAt`; moving off COMPLETED clears it (verified via e2e `task-completion.spec.ts`)
- [x] 3.5 Search works — `/my-task?q=birthday` filters by title/description match, and the Header search bar navigates to `/my-task?q=...` correctly (verified via e2e `task-search.spec.ts`, 2 specs)

## 4. Vital Task
- [x] 4.1 Starring a task in My Task surfaces it on `/vital-task` (verified via e2e `vital-task.spec.ts`)
- [x] 4.2 `/vital-task` shows the empty-state message when no vital tasks exist (verified via e2e `vital-task.spec.ts`)

## 5. Task Categories
- [x] 5.1 Create category with name + color (verified via e2e `category-filter.spec.ts`)
- [x] 5.2 Assign a task to a category via the task form's category select (verified via e2e)
- [x] 5.3 Filter My Task by category via `/my-task?categoryId={id}` (verified via e2e)
- [x] 5.4 Deleting a category sets `categoryId = null` on its tasks rather than deleting the tasks (verified via e2e `category-delete.spec.ts`)
- [x] 5.5 Duplicate category name for the same user is rejected with 409, and the same name is allowed across different users (verified via e2e `category-duplicate.spec.ts`)

## 6. Settings
- [x] 6.1 Profile form updates name/avatar and persists via `PATCH /api/users/me` (verified via e2e `settings-profile.spec.ts`). Note: the Sidebar's displayed name comes from the session JWT (set at login), not a live DB read, so it won't reflect a profile-name change until the user logs in again — this is expected JWT-strategy behavior, not a bug, and the test verifies persistence via `GET /api/users/me` instead of the Sidebar.
- [x] 6.2 Settings page lists sent invites with status and lets the user revoke a PENDING invite (verified via e2e `settings-invites.spec.ts`, 2 specs)

## 7. Help
- [x] 7.1 `/help` renders static FAQ content with 6 Q&A entries, no DB dependency (verified via manual review of `src/app/(dashboard)/help/page.tsx`)

## 8. Invites / Collaborators
- [x] 8.1 "+ Invite" button opens dialog, `POST /api/invites` creates a PENDING Invite row tied to `senderId` (verified via e2e `invite-dialog.spec.ts`)
- [x] 8.2 Invited collaborator avatars render on the Welcome banner once a Collaborator row exists (verified via e2e `collaborators.spec.ts`)

## 9. Quality gates (recurring — re-verify every iteration before checking off new work)
- [x] 9.1 `npm run build` succeeds
- [x] 9.2 `npm run lint` succeeds
- [x] 9.3 `npm run typecheck` succeeds
- [x] 9.4 `npm run test` (vitest, 12 tests: task-stats, validations, DonutChart) succeeds
- [x] 9.5 `npm run test:e2e` (playwright, 20 specs: redirect, signup, bad-login, logout, dashboard completed-tasks, task-completion (completedAt), task-search (2 specs), vital-task (2 specs), category-delete, category-duplicate (2 specs), settings-profile, settings-invites (2 specs), invite-dialog, collaborators, task CRUD, category filter) succeeds — verified stable across multiple full-suite runs. **`playwright.config.ts`'s `webServer` now runs `npm run build && npm run start` (production mode), not `npm run dev`.** `next dev` is single-process and showed genuine concurrency failures (`MissingCSRF`, request timeouts) once more than ~6 tests ran in parallel — this reproduced even across different fresh user accounts, so it wasn't just about sharing the seeded account. Every e2e spec still signs up its own fresh user via `signupAndLogin()` in `tests/e2e/helpers.ts` (good practice regardless) and uses `page.request` to seed data via the API rather than the `prisma/seed.ts` demo account.

### Major finding this session: production mode surfaced two real bugs dev mode was hiding
Switching e2e to production mode (`next build && next start`) caused near-total failure at first —
not because production is stricter for no reason, but because it exposed two genuine bugs that
`next dev`'s more permissive/relaxed behavior had been masking:
1. **`UntrustedHost` on every `auth()` call in production.** Fixed by adding `trustHost: true` to
   the `NextAuth(...)` config in `src/lib/auth.ts`. Auth.js v5 requires this explicitly in
   production; dev mode infers it automatically.
2. **Logout didn't reliably clear the session (a real, user-facing bug).** Root cause: Sidebar's
   nav `<Link>`s (rendered on every authenticated page, including the one you click Logout from)
   prefetch their target routes by default. `proxy.ts`'s `auth()` middleware "touches"/re-issues
   a fresh session cookie on every request it handles. If a prefetch request to a protected route
   was in flight when the user logged out, its late-arriving response would re-issue a valid
   session cookie *after* the logout's cookie-clearing had already run, silently undoing the
   logout. Confirmed via a debug spec run 10x that failed ~40% of the time before the fix and
   0/10 after. Fix, two parts:
   - `src/components/layout/Sidebar.tsx`: added `prefetch={false}` to the nav `<Link>`s — this is
     the actual fix; without it the bug reproduces regardless of anything else below.
   - `src/lib/auth-client.ts`: a `logout()` helper using a real (native) `<form>` POST to
     `/api/auth/signout` instead of `next-auth/react`'s `signOut()`, which lets the browser
     handle the redirect + cookie-clear + navigate as one atomic sequence. Kept as a robustness
     improvement even though the prefetch fix was the actual root cause.
   - `src/components/Providers.tsx`: removed `<SessionProvider>` entirely — grep confirms
     `useSession()` is never called anywhere in the app (all auth state flows through the
     server-side `auth()` helper), so it was unused overhead that only added another background
     `/api/auth/session` poll per page load. Its removal alone did not fix the race (still
     reproduced without it), but it's legitimate dead-code removal worth keeping.
   **Takeaway for future iterations**: if a new authenticated Link/prefetchable route is added
   near an action that clears auth state (logout, account deletion, etc.), consider whether the
   same prefetch-touches-session race could resurface, and prefer `prefetch={false}` on links
   rendered alongside such actions.

## Environment notes for the loop
- `DATABASE_URL` / `TEST_DATABASE_URL` point at a dedicated Docker Postgres container
  (`todo-app-postgres`, port 5433 — separate from any other project's Postgres instance). If that
  container isn't running, treat 0.3 as `[!]` blocked and start it with:
  `docker start todo-app-postgres` (or recreate per the plan if it no longer exists) rather than
  attempting to provision new infrastructure.
- `npm run test:e2e` now builds and starts its own production server (`reuseExistingServer:
  false` in `playwright.config.ts`), so **port 3000 must be free before running it** — stop any
  manually-started `npm run dev` first (see the Windows DLL-lock note below for how). Playwright
  owns that server's lifecycle for the duration of the run and shuts it down after.
- On Windows, `npm run build` (which runs `prisma generate` first) fails with
  `EPERM: operation not permitted, rename ... query_engine-windows.dll.node` if a `npm run dev`
  (or `npm run start`) process is currently running, since it holds the native engine DLL open.
  Stop it first (find `node.exe` PIDs via
  `Get-CimInstance Win32_Process -Filter "Name='node.exe'"` and `Stop-Process -Force`) before
  running `build` or `test:e2e`. If you want an interactive dev server to browse the app
  afterward, start `npm run dev` again once verification is done — it's independent of what
  `test:e2e` uses internally.
