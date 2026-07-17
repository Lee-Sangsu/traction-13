# Traction 13 Program Platform Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-shaped Spanish founder and administrator application for the Traction 13 workflow, including versioned program templates, auditable multi-agent soft gates, Supabase persistence, and a fully usable local demo mode.

**Architecture:** Keep the public marketing site at `/`, then add isolated founder (`/app`) and administrator (`/admin`) route groups with their own shells. Store canonical program definitions and demo fixtures as typed domain data, persist production records in Supabase behind repository interfaces, and run gate evaluations through a durable queue plus a provider-agnostic orchestrator. When Supabase or LLM credentials are absent, use deterministic local adapters so the complete product can still be reviewed and tested.

**Tech Stack:** Next.js 16 App Router, React 18, TypeScript, Tailwind CSS 4, shadcn/ui, Zod, Supabase Auth/PostgreSQL/Storage/Realtime/Queues, Vitest, Testing Library.

---

### Task 1: Establish the platform foundation and test harness

**Files:**
- Modify: `package.json`
- Modify: `app/layout.tsx`
- Create: `app/(marketing)/layout.tsx`
- Move: `app/page.tsx` to `app/(marketing)/page.tsx`
- Create: `dictionaries/es.json`
- Create: `lib/i18n/es.ts`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Test: `lib/i18n/es.test.ts`

**Step 1: Write the failing dictionary test**

```ts
import { describe, expect, it } from "vitest"
import { dictionary } from "@/lib/i18n/es"

describe("Spanish product dictionary", () => {
  it("contains the primary founder and admin navigation labels", () => {
    expect(dictionary.founder.navigation.today).toBe("Hoy")
    expect(dictionary.admin.navigation.commandCenter).toBe("Centro de control")
  })
})
```

**Step 2: Run the test to verify it fails**

Run: `npm test -- lib/i18n/es.test.ts`  
Expected: FAIL because the Vitest configuration and dictionary module do not exist.

**Step 3: Install and configure dependencies**

Add scripts:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "type-check": "tsc --noEmit",
  "lint": "next lint"
}
```

Add runtime dependencies:

```text
@supabase/ssr
@supabase/supabase-js
```

Add development dependencies:

```text
@testing-library/jest-dom
@testing-library/react
@vitejs/plugin-react
jsdom
vitest
```

Move the marketing header and footer into `app/(marketing)/layout.tsx`. Keep the
root layout responsible only for fonts, metadata, analytics, global styles, and
toasts. Set the document language to `es`.

Load and type-check the Spanish JSON dictionary from `lib/i18n/es.ts`.

**Step 4: Run the test and type checker**

Run: `npm test -- lib/i18n/es.test.ts && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add package.json package-lock.json app dictionaries lib/i18n vitest.config.ts tests/setup.ts
git commit -m "chore: establish program platform foundation"
```

### Task 2: Model the Traction 13 curriculum and outcome state

**Files:**
- Create: `lib/traction/types.ts`
- Create: `lib/traction/curriculum.ts`
- Create: `lib/traction/demo-data.ts`
- Create: `lib/traction/progression.ts`
- Test: `lib/traction/curriculum.test.ts`
- Test: `lib/traction/progression.test.ts`

**Step 1: Write failing curriculum and progression tests**

```ts
it("defines exactly thirteen ordered Traction 13 days", () => {
  expect(traction13.days).toHaveLength(13)
  expect(traction13.days.map((day) => day.number)).toEqual(
    Array.from({ length: 13 }, (_, index) => index + 1),
  )
})

it("keeps a dependent mission locked until its gate advances", () => {
  expect(canOpenDay({ requestedDay: 7, unlockedThrough: 6 })).toBe(false)
  expect(canOpenDay({ requestedDay: 6, unlockedThrough: 6 })).toBe(true)
})
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- lib/traction/curriculum.test.ts lib/traction/progression.test.ts`  
Expected: FAIL because the curriculum and progression modules do not exist.

**Step 3: Implement typed domain models**

Define:

```ts
type OutcomeDimension = "problem" | "offer" | "sales"
type GateDecision =
  | "advance"
  | "revise"
  | "validate_more"
  | "redirect"
  | "accelerate"
  | "admin_intervention"
```

Add typed models for program versions, days, activities, evidence requirements,
founders, ventures, journey state, submissions, outcome snapshots, agent runs,
and interventions.

Encode the approved thirteen-day curriculum with Spanish titles, missions,
evidence requirements, active agents, estimated effort, and dependencies.

Create realistic demo fixtures for one active founder, a cohort, evidence,
offers, sales asks, agent runs, and admin alerts.

**Step 4: Run tests**

Run: `npm test -- lib/traction`  
Expected: PASS.

**Step 5: Commit**

```bash
git add lib/traction
git commit -m "feat: model the Traction 13 journey"
```

### Task 3: Implement the multi-agent soft-gate engine

**Files:**
- Create: `lib/agents/schemas.ts`
- Create: `lib/agents/registry.ts`
- Create: `lib/agents/provider.ts`
- Create: `lib/agents/deterministic-provider.ts`
- Create: `lib/agents/context.ts`
- Create: `lib/agents/orchestrator.ts`
- Test: `lib/agents/orchestrator.test.ts`

**Step 1: Write failing orchestration tests**

```ts
it("activates only agents configured for the gate", async () => {
  const result = await orchestrateGate(dayFourInterviewPlanFixture)
  expect(result.steps.map((step) => step.agent)).toEqual([
    "evidence",
    "problem",
    "consistency",
    "mentor",
    "journey",
  ])
})

it("escalates materially conflicting findings", async () => {
  const result = await orchestrateGate(conflictingEvidenceFixture)
  expect(result.decision).toBe("admin_intervention")
  expect(result.disagreement).toBeGreaterThanOrEqual(0.5)
})
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- lib/agents/orchestrator.test.ts`  
Expected: FAIL because the orchestrator does not exist.

**Step 3: Implement the agent registry and schemas**

Create Zod schemas for evidence, problem, offer, sales, consistency, mentor,
journey, and orchestrator results. Every finding must include:

```ts
{
  verdict: "strong" | "mixed" | "weak" | "not_applicable"
  confidence: number
  summary: string
  evidenceIds: string[]
  concerns: string[]
  recommendedActions: string[]
}
```

Define a provider interface that can later call an external LLM. Implement a
deterministic provider for tests and local demo mode. It must evaluate fixture
content without network access and return Spanish coaching.

Build an immutable context snapshot, execute the configured evaluator agents,
calculate disagreement, execute the mentor and Journey Agents, then validate
the orchestrator's final structured result.

**Step 4: Run tests**

Run: `npm test -- lib/agents`  
Expected: PASS.

**Step 5: Commit**

```bash
git add lib/agents
git commit -m "feat: add auditable multi-agent gate orchestration"
```

### Task 4: Add the Supabase production schema and access layer

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/config.ts`
- Create: `lib/repositories/program-repository.ts`
- Create: `lib/repositories/demo-program-repository.ts`
- Create: `lib/repositories/supabase-program-repository.ts`
- Create: `supabase/config.toml`
- Create: `supabase/migrations/202607170001_core_schema.sql`
- Create: `supabase/migrations/202607170002_rls.sql`
- Create: `supabase/migrations/202607170003_agent_queue.sql`
- Create: `supabase/seed.sql`
- Test: `lib/repositories/demo-program-repository.test.ts`

**Step 1: Write the failing repository contract test**

```ts
it("returns a founder journey without leaking another founder", async () => {
  const repository = createDemoProgramRepository()
  const journey = await repository.getFounderJourney("founder-sofia")
  expect(journey.founderId).toBe("founder-sofia")
  expect(JSON.stringify(journey)).not.toContain("founder-unrelated")
})
```

**Step 2: Run the test to verify it fails**

Run: `npm test -- lib/repositories/demo-program-repository.test.ts`  
Expected: FAIL because repository adapters do not exist.

**Step 3: Implement the schema and adapters**

Create normalized tables for the data domains in the approved design. Add
foreign keys, unique idempotency constraints, immutable version constraints,
timestamps, and useful indexes.

Enable Row Level Security on all exposed tables. Add policies for:

- A founder reading and editing their records.
- Venture members reading explicitly shared venture artifacts.
- Cohort administrators operating assigned cohorts.
- Server-only workers processing queued evaluations.

Create private evidence storage policy helpers and queue functions:

```sql
create or replace function public.enqueue_gate_run(p_gate_run_id uuid)
returns bigint
language sql
security definer
set search_path = public, pgmq
as $$
  select * from pgmq.send(
    'gate_evaluations',
    jsonb_build_object('gate_run_id', p_gate_run_id)
  );
$$;
```

Use the demo repository when public Supabase environment variables are absent.
Use the Supabase repository in configured deployments.

**Step 4: Run tests and inspect SQL**

Run: `npm test -- lib/repositories && npm run type-check`  
Expected: PASS.

Run when Supabase CLI is available: `supabase db reset`  
Expected: All migrations and seed data apply without error.

**Step 5: Commit**

```bash
git add lib/supabase lib/repositories supabase
git commit -m "feat: add Supabase program data architecture"
```

### Task 5: Build the shared authenticated product shell

**Files:**
- Create: `components/platform/app-shell.tsx`
- Create: `components/platform/product-sidebar.tsx`
- Create: `components/platform/mobile-product-nav.tsx`
- Create: `components/platform/top-bar.tsx`
- Create: `components/platform/outcome-strip.tsx`
- Create: `app/(platform)/app/layout.tsx`
- Create: `app/(platform)/admin/layout.tsx`
- Create: `app/(auth)/auth/page.tsx`
- Create: `proxy.ts`
- Test: `components/platform/app-shell.test.tsx`

**Step 1: Write the failing shell test**

```tsx
it("renders Spanish navigation for the selected product role", () => {
  render(<AppShell role="founder"><div>Contenido</div></AppShell>)
  expect(screen.getByText("Hoy")).toBeInTheDocument()
  expect(screen.getByText("Mi recorrido")).toBeInTheDocument()
  expect(screen.queryByText("Centro de control")).not.toBeInTheDocument()
})
```

**Step 2: Run the test to verify it fails**

Run: `npm test -- components/platform/app-shell.test.tsx`  
Expected: FAIL because the shell does not exist.

**Step 3: Implement the responsive shell**

Use the existing Traction colors and typography with a product-oriented visual
system:

- Black navigation rail
- Warm off-white work surface
- Orange priority actions
- Blue problem outcome
- Magenta offer outcome
- Yellow sales outcome
- Monospace operational metadata

Add role-specific navigation, accessible active states, mobile drawer
navigation, account menu, notification access, cohort context, and demo-mode
indicator.

Protect production routes through Supabase session refresh in `proxy.ts`.
Permit demo access when Supabase is not configured.

**Step 4: Run tests and type checking**

Run: `npm test -- components/platform && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add app components/platform proxy.ts
git commit -m "feat: add founder and admin product shells"
```

### Task 6: Build the founder Today dashboard and journey

**Files:**
- Create: `app/(platform)/app/page.tsx`
- Create: `app/(platform)/app/recorrido/page.tsx`
- Create: `app/(platform)/app/recorrido/[day]/page.tsx`
- Create: `components/founder/today-mission.tsx`
- Create: `components/founder/journey-map.tsx`
- Create: `components/founder/mentor-card.tsx`
- Create: `components/founder/evidence-checklist.tsx`
- Create: `components/founder/gate-status.tsx`
- Test: `components/founder/today-mission.test.tsx`

**Step 1: Write the failing mission test**

```tsx
it("shows the current mission and its required evidence", () => {
  render(<TodayMission day={traction13.days[4]} />)
  expect(screen.getByText("Escucha evidencia")).toBeInTheDocument()
  expect(screen.getByText(/entrevistas reales/i)).toBeInTheDocument()
})
```

**Step 2: Run the test to verify it fails**

Run: `npm test -- components/founder/today-mission.test.tsx`  
Expected: FAIL because founder components do not exist.

**Step 3: Implement the dashboard and journey**

The dashboard must show one dominant mission, deadline, estimated effort,
evidence checklist, latest mentor push, gate state, and three outcome signals.

The journey page must show all thirteen days with completed, active, locked,
recovery, and accelerated states. Day detail pages show context, mission,
resources, evidence requirements, previous attempts, and the current agent
decision.

**Step 4: Run tests**

Run: `npm test -- components/founder && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add app/\\(platform\\)/app components/founder
git commit -m "feat: build founder journey and daily mission"
```

### Task 7: Build evidence, problem, offer, and sales workspaces

**Files:**
- Create: `app/(platform)/app/evidencia/page.tsx`
- Create: `app/(platform)/app/problema/page.tsx`
- Create: `app/(platform)/app/oferta/page.tsx`
- Create: `app/(platform)/app/ventas/page.tsx`
- Create: `components/founder/evidence-studio.tsx`
- Create: `components/founder/problem-board.tsx`
- Create: `components/founder/offer-builder.tsx`
- Create: `components/founder/sales-pipeline.tsx`
- Create: `components/founder/submission-dialog.tsx`
- Create: `app/api/submissions/route.ts`
- Test: `components/founder/sales-pipeline.test.tsx`

**Step 1: Write the failing sales semantics test**

```tsx
it("distinguishes an ask from a commitment and revenue", () => {
  render(<SalesPipeline events={salesFixture} />)
  expect(screen.getByText("Pedido realizado")).toBeInTheDocument()
  expect(screen.getByText("Compromiso")).toBeInTheDocument()
  expect(screen.getByText("Ingreso")).toBeInTheDocument()
})
```

**Step 2: Run the test to verify it fails**

Run: `npm test -- components/founder/sales-pipeline.test.tsx`  
Expected: FAIL because the sales workspace does not exist.

**Step 3: Implement the four workspaces**

Provide structured forms, empty states, version timelines, evidence links, and
source-aware outcome summaries. Use `<section>` for every new feature section.

The submission route validates the payload, stores demo submissions locally in
the adapter or production submissions in Supabase, creates an immutable
snapshot, and returns a queued gate-run state.

**Step 4: Run tests**

Run: `npm test -- components/founder app/api/submissions && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add app/\\(platform\\)/app app/api/submissions components/founder
git commit -m "feat: add founder evidence and outcome workspaces"
```

### Task 8: Build the mentor and evaluation experience

**Files:**
- Create: `app/(platform)/app/mentor/page.tsx`
- Create: `components/mentor/mentor-workspace.tsx`
- Create: `components/mentor/evaluation-panel.tsx`
- Create: `components/mentor/agent-trace.tsx`
- Create: `components/mentor/next-action-card.tsx`
- Create: `app/api/mentor/route.ts`
- Create: `app/api/evaluations/route.ts`
- Create: `workers/gate-worker.ts`
- Test: `app/api/evaluations/route.test.ts`

**Step 1: Write the failing evaluation API test**

```ts
it("returns a structured, cited soft-gate decision", async () => {
  const response = await POST(createGateRequest(dayFiveSubmissionFixture))
  const body = await response.json()
  expect(body.decision).toMatch(/advance|revise|validate_more|redirect/)
  expect(body.findings.every((finding: { evidenceIds: string[] }) =>
    finding.evidenceIds.length > 0
  )).toBe(true)
})
```

**Step 2: Run the test to verify it fails**

Run: `npm test -- app/api/evaluations/route.test.ts`  
Expected: FAIL because the route does not exist.

**Step 3: Implement mentor and evaluation APIs**

The mentor endpoint accepts founder messages plus a bounded context reference.
The evaluation endpoint invokes deterministic orchestration in demo mode and
enqueues a gate run in production.

The mentor UI separates:

- Founder conversation
- Evidence-backed evaluation
- Agent participation
- Decision confidence
- Exact next action

The worker consumes a gate run, locks it idempotently, constructs the context,
runs the configured agents, stores every step, publishes the decision, and
archives the queue message.

**Step 4: Run tests**

Run: `npm test -- app/api/evaluations lib/agents && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add app/\\(platform\\)/app/mentor app/api/mentor app/api/evaluations components/mentor workers
git commit -m "feat: connect mentor and multi-agent evaluations"
```

### Task 9: Build the admin command center and participant operations

**Files:**
- Create: `app/(platform)/admin/page.tsx`
- Create: `app/(platform)/admin/participantes/page.tsx`
- Create: `app/(platform)/admin/participantes/[id]/page.tsx`
- Create: `app/(platform)/admin/intervenciones/page.tsx`
- Create: `components/admin/command-center.tsx`
- Create: `components/admin/cohort-health.tsx`
- Create: `components/admin/participant-table.tsx`
- Create: `components/admin/intervention-queue.tsx`
- Create: `components/admin/override-dialog.tsx`
- Test: `components/admin/intervention-queue.test.tsx`

**Step 1: Write the failing priority test**

```tsx
it("orders interventions by severity and age", () => {
  render(<InterventionQueue items={unorderedInterventionsFixture} />)
  const items = screen.getAllByTestId("intervention-row")
  expect(items[0]).toHaveTextContent("Conflicto de evidencia")
})
```

**Step 2: Run the test to verify it fails**

Run: `npm test -- components/admin/intervention-queue.test.tsx`  
Expected: FAIL because the admin operations components do not exist.

**Step 3: Implement admin operations**

Show cohort progress, problem/offer/sales movement, blocked founders, overdue
missions, low-confidence runs, agent failures, and cost signals.

Participant detail must combine journey, evidence, agent history, internal
notes, team state, deadline exceptions, and override controls. Every override
requires a reason and shows its effect before confirmation.

**Step 4: Run tests**

Run: `npm test -- components/admin && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add app/\\(platform\\)/admin components/admin
git commit -m "feat: build admin cohort and intervention operations"
```

### Task 10: Build template and agent operations studios

**Files:**
- Create: `app/(platform)/admin/programas/page.tsx`
- Create: `app/(platform)/admin/programas/[id]/page.tsx`
- Create: `app/(platform)/admin/agentes/page.tsx`
- Create: `app/(platform)/admin/configuracion/page.tsx`
- Create: `components/admin/template-studio.tsx`
- Create: `components/admin/day-editor.tsx`
- Create: `components/admin/gate-editor.tsx`
- Create: `components/admin/agent-operations.tsx`
- Create: `components/admin/agent-run-detail.tsx`
- Test: `components/admin/template-studio.test.tsx`

**Step 1: Write the failing immutable version test**

```tsx
it("offers cloning instead of editing an active template version", () => {
  render(<TemplateStudio template={activeTraction13Fixture} />)
  expect(screen.getByRole("button", { name: /crear nueva version/i })).toBeEnabled()
  expect(screen.queryByRole("button", { name: /^guardar$/i })).not.toBeInTheDocument()
})
```

**Step 2: Run the test to verify it fails**

Run: `npm test -- components/admin/template-studio.test.tsx`  
Expected: FAIL because the template studio does not exist.

**Step 3: Implement studios**

Provide a visual thirteen-day editor for phases, activities, evidence
requirements, dependencies, gate agents, rubrics, and deadlines. Active
versions are read-only; cloning creates a draft.

The agent operations view shows run state, step timeline, findings, cited
evidence, model and prompt versions, disagreement, confidence, cost, latency,
retries, and dead-letter actions.

**Step 4: Run tests**

Run: `npm test -- components/admin && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add app/\\(platform\\)/admin components/admin
git commit -m "feat: add program template and agent operations studios"
```

### Task 11: Add teams, notifications, reporting, and settings

**Files:**
- Create: `app/(platform)/app/equipo/page.tsx`
- Create: `app/(platform)/app/reporte/page.tsx`
- Create: `app/(platform)/app/configuracion/page.tsx`
- Create: `app/(platform)/admin/reportes/page.tsx`
- Create: `components/founder/team-builder.tsx`
- Create: `components/founder/traction-report.tsx`
- Create: `components/platform/notification-center.tsx`
- Create: `components/admin/outcome-report.tsx`
- Test: `components/founder/traction-report.test.tsx`

**Step 1: Write the failing source-traceability test**

```tsx
it("links every report claim to supporting evidence", () => {
  render(<TractionReport report={tractionReportFixture} />)
  expect(screen.getAllByRole("link", { name: /ver evidencia/i })).toHaveLength(
    tractionReportFixture.claims.length,
  )
})
```

**Step 2: Run the test to verify it fails**

Run: `npm test -- components/founder/traction-report.test.tsx`  
Expected: FAIL because reporting does not exist.

**Step 3: Implement completion features**

Add optional founder discovery and team invitations, source-linked traction
report and pitch preparation, notification center, account/privacy settings,
and admin cohort reporting.

Keep team permissions explicit and preserve individual journey history.

**Step 4: Run tests**

Run: `npm test && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add app/\\(platform\\) components
git commit -m "feat: complete collaboration and reporting workflows"
```

### Task 12: Verify the production build and visual quality

**Files:**
- Modify as needed: `app/**/*.tsx`
- Modify as needed: `components/**/*.tsx`
- Modify as needed: `app/globals.css`
- Create: `docs/testing/traction-13-platform-checklist.md`

**Step 1: Run the complete automated suite**

Run: `npm test`  
Expected: All tests pass.

Run: `npm run type-check`  
Expected: No TypeScript errors.

Run: `npm run build`  
Expected: Successful Next.js production build.

**Step 2: Run the application**

Run: `npm run dev`  
Expected: Landing page at `/`, founder product at `/app`, and admin product at
`/admin`.

**Step 3: Inspect representative viewports**

Verify at minimum:

- Founder Today: 390x844 and 1440x1000
- Journey: 390x844 and 1440x1000
- Mentor: 390x844 and 1440x1000
- Admin command center: 768x1024 and 1440x1000
- Template studio: 768x1024 and 1440x1000
- Agent run detail: 768x1024 and 1440x1000

Check keyboard navigation, visible focus, labels, contrast, overflow, Spanish
copy, empty states, loading states, and error states.

**Step 4: Record verification**

Document automated commands, browser routes, viewports, findings, and any
remaining environment-dependent steps such as applying migrations to a real
Supabase project or configuring a live LLM provider.

**Step 5: Commit**

```bash
git add app components docs/testing
git commit -m "test: verify Traction 13 platform experience"
```
