# Goal loop protocol (for use with the ralph-loop plugin)

This file is the per-iteration protocol for driving this project's build via the `ralph-loop`
plugin. Each time this prompt is re-fed to you, do exactly ONE unit of work, verify it for real,
update `OBJECTIVES.md`, and report — then stop. Do not try to finish everything in one iteration.

## Step 1 — Read state
1. Read `OBJECTIVES.md` in full.
2. Confirm the dev database is reachable: `docker ps --filter name=todo-app-postgres`. If the
   container isn't running, start it with `docker start todo-app-postgres`. If it doesn't exist
   at all, treat objective 0.3 as `[!]` blocked and stop this iteration with a report explaining
   that — do not try to provision new infrastructure yourself.
3. Pick the next item to work on: prefer any `[~]` (already in progress) item, then any `[!]`
   (blocked) item whose blocker looks resolved, otherwise the next `[ ]` item in file order.
4. If every item is `[x]`, skip straight to Step 5 (Completion check).

## Step 2 — Implement
1. Mark the chosen item `[~]` in `OBJECTIVES.md` before starting.
2. Read the current code relevant to that item before writing anything — most of the app already
   exists (Next.js App Router + Prisma + NextAuth v5 + Tailwind). Follow existing conventions:
   - Business logic lives in `src/lib/tasks.ts` / `categories.ts` / `invites.ts`; route handlers
     under `src/app/api/**` and pages under `src/app/(dashboard)/**` are thin wrappers around it.
   - UI primitives are in `src/components/ui/`; reuse `Button`, `Input`, `Label` (needs
     `htmlFor`/`id` pairs — see the accessibility note below), `Select`, `Textarea`, `Dialog`.
   - Client components that mutate data call `router.refresh()` afterward rather than managing
     duplicate client-side state — Server Components re-fetch on refresh.
3. **Accessibility/testability rule**: every `<Label>` must have `htmlFor` pointing at a matching
   `id` on its field. This was a real bug found and fixed once already (Playwright's
   `getByLabel()` and screen readers both depend on it) — don't reintroduce it.
4. Implement the smallest correct change that satisfies the item's acceptance test. Don't add
   new architecture or dependencies unless the objective genuinely requires it.
5. If the item depends on something not yet built, stop, mark it `[!]` with a one-line blocker
   note, and pick the actual dependency as the new target instead.

## Step 3 — Verify (do not skip — "looks done" is not done)
Run in order, cheapest first, fixing forward on failure before proceeding:
1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. `npm run test` (vitest — add a spec under `tests/unit/` if the objective is a pure
   function/component and none exists yet)
5. The objective's specific acceptance test:
   - API/status-code checks: use `curl` against a running dev server (start one with
     `npm run dev` in the background if none is running; curl each route once first to warm
     Turbopack's lazy compilation before relying on timing-sensitive checks — a cold first hit to
     an uncompiled route can look like a transient failure).
   - UI/browser-behavior checks: add or extend a Playwright spec under `tests/e2e/` (see
     `tests/e2e/helpers.ts`'s `signupAndLogin` for the pattern — each e2e test should sign up its
     own fresh user rather than sharing the seeded demo user, since tests run in parallel) and
     run `npm run test:e2e`. Keep the spec — it's permanent regression coverage, not throwaway.
   - DB-state checks: query via a short one-off script using `@prisma/client`, don't assume.
6. If a check fails, fix the implementation. Only correct the objective's wording in
   `OBJECTIVES.md` if the acceptance test itself was actually wrong/ambiguous, and say so in the
   report.

## Step 4 — Update checklist
1. Mark the item `[x]` only if every check in Step 3 passed this run.
2. Leave `[~]` with a one-line sub-note if partially done.
3. Mark `[!]` with a blocker description if genuinely stuck on something outside the codebase.
4. Never mark `[x]` based on prior claims or "should work" — only this iteration's actual output.

## Step 5 — Completion check (loop-termination signal)
1. Re-scan `OBJECTIVES.md`. If every line is `[x]`:
   - Re-run the full quality gate once more (typecheck, lint, build, test, test:e2e) as a final
     confirmation sweep.
   - If all green, output the literal tag on its own line:
     `<promise>ALL OBJECTIVES COMPLETE</promise>`
     This is the exact phrase the ralph-loop stop hook was started with
     (`--completion-promise "ALL OBJECTIVES COMPLETE"`) — only output it when it is genuinely,
     unequivocally true. Do not output it to escape the loop if you're stuck; leave the relevant
     item `[~]`/`[!]` instead and let the loop continue.
   - If the final sweep finds a regression, revert the affected item(s) to `[ ]`/`[~]` with a
     note, and do NOT output the promise.
2. If items remain unmet, do not output the promise — just end normally (Step 6) so the next
   ralph-loop iteration continues.

## Step 6 — Status report (always end with this)
```
## goal-loop status — <timestamp>
Worked on: <objective id + short title>
Result: done | partially done | blocked
Verification: typecheck <pass/fail>, lint <pass/fail>, build <pass/fail>, test <pass/fail>, acceptance test <pass/fail>
Checklist updates: <objective ids changed and their new marker>
Next up: <next objective id + short title>
Blockers: <none, or specific description + what's needed>
```
If Step 5 determined everything is complete, end with the `<promise>` tag instead of "Next up".

## Ground rules
- Never commit or push unless explicitly asked — this loop's job is code + `OBJECTIVES.md`
  updates only.
- Never delete or weaken an acceptance test to make it easier to pass.
- One objective per iteration — resist refactoring unrelated code; file real new requirements as
  a new `OBJECTIVES.md` line instead of doing them inline.
- Safe to re-invoke unattended: re-running after a fully-completed state should immediately hit
  Step 5 and re-emit the promise without making changes.
