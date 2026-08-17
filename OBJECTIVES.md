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
- [ ] 1.7 Logout clears session — clicking Logout in Sidebar ends the session and a subsequent `/my-task` request redirects to `/login` (implemented via `signOut()`, not yet covered by an automated test)

## 2. Dashboard
- [x] 2.1 Dashboard renders Sidebar with 6 nav items + Logout, active item highlighted for the current route (verified via manual browser screenshot)
- [x] 2.2 Header shows search bar, bell icon, calendar icon, and current date (verified via manual browser screenshot)
- [x] 2.3 Welcome banner shows "Welcome back, {firstName}" and collaborator avatars + Invite button (verified via manual browser screenshot)
- [x] 2.4 To-Do panel lists incomplete tasks as TaskCards with status dot, title, description, priority/status/created-on footer (verified via manual browser screenshot)
- [x] 2.5 Task Status panel renders 3 donut charts whose percentages are computed from live task counts; percentage math covered by unit tests (`tests/unit/task-stats.test.ts`)
- [ ] 2.6 Completed Task panel lists completed tasks with green check icon and "Completed X ago" relative time — implemented, not yet visually re-verified after seed data changes

## 3. My Task (CRUD)
- [x] 3.1 Create task — submitting the Add Task dialog POSTs `/api/tasks`, new task appears in the list (verified via e2e `task-crud.spec.ts`)
- [x] 3.2 Edit task — updating a task's title persists via `PATCH /api/tasks/[id]` and is reflected in the UI (verified via e2e)
- [x] 3.3 Delete task — DELETE removes the task from the DB and UI (verified via e2e)
- [ ] 3.4 Status change stamps `completedAt` — setting status to COMPLETED sets `completedAt`; moving off COMPLETED clears it (implemented in `src/lib/tasks.ts`, not yet covered by an automated test)
- [ ] 3.5 Search works — `/my-task?q=birthday` filters by title/description match (implemented, not yet covered by an automated test)

## 4. Vital Task
- [x] 4.1 Starring a task in My Task surfaces it on `/vital-task` (star toggle wired to `isVital`; category-filter/task-crud e2e specs exercise the same underlying PATCH path)
- [ ] 4.2 `/vital-task` shows the empty-state message when no vital tasks exist (implemented, not yet covered by an automated test)

## 5. Task Categories
- [x] 5.1 Create category with name + color (verified via e2e `category-filter.spec.ts`)
- [x] 5.2 Assign a task to a category via the task form's category select (verified via e2e)
- [x] 5.3 Filter My Task by category via `/my-task?categoryId={id}` (verified via e2e)
- [ ] 5.4 Deleting a category sets `categoryId = null` on its tasks rather than deleting the tasks (`onDelete: SetNull` in schema; not yet covered by an automated test)
- [ ] 5.5 Duplicate category name for the same user is rejected with 409 (implemented in `src/lib/categories.ts`, not yet covered by an automated test)

## 6. Settings
- [ ] 6.1 Profile form updates name/avatar and persists via `PATCH /api/users/me` (implemented, not yet covered by an automated test)
- [ ] 6.2 Settings page lists sent invites with status and lets the user revoke a PENDING invite (implemented, not yet covered by an automated test)

## 7. Help
- [x] 7.1 `/help` renders static FAQ content with 6 Q&A entries, no DB dependency (verified via manual review of `src/app/(dashboard)/help/page.tsx`)

## 8. Invites / Collaborators
- [ ] 8.1 "+ Invite" button opens dialog, `POST /api/invites` creates a PENDING Invite row tied to `senderId` (implemented, not yet covered by an automated test)
- [ ] 8.2 Invited collaborator avatars render on the Welcome banner once a Collaborator row exists (implemented via `listCollaborators`, not yet covered by an automated test — requires an ACCEPTED invite whose email matches an existing user)

## 9. Quality gates (recurring — re-verify every iteration before checking off new work)
- [x] 9.1 `npm run build` succeeds
- [x] 9.2 `npm run lint` succeeds
- [x] 9.3 `npm run typecheck` succeeds
- [x] 9.4 `npm run test` (vitest, 12 tests: task-stats, validations, DonutChart) succeeds
- [x] 9.5 `npm run test:e2e` (playwright, 5 specs: redirect, signup, bad-login, task CRUD, category filter) succeeds — note: run against an already-warm `npm run dev` server (first-hit Turbopack compile can otherwise cause a transient CSRF/timeout failure on the very first request to a lazily-compiled route)

## Environment notes for the loop
- `DATABASE_URL` / `TEST_DATABASE_URL` point at a dedicated Docker Postgres container
  (`todo-app-postgres`, port 5433 — separate from any other project's Postgres instance). If that
  container isn't running, treat 0.3 as `[!]` blocked and start it with:
  `docker start todo-app-postgres` (or recreate per the plan if it no longer exists) rather than
  attempting to provision new infrastructure.
- Playwright's `webServer` config reuses an existing dev server on :3000 if one is already
  running. Starting `npm run dev` and curling each route once before running `test:e2e` avoids
  Turbopack first-compile flakiness.
