# Standalone Multi-Agent Backend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an independently deployable Fastify service that runs bounded multi-agent deliberations, persists inter-agent communication, judges and evaluates decisions, safely queues work for 100 connected users, and uses protected Codex or Claude subscription credentials on a trusted Google Cloud VM.

**Architecture:** The service lives in `agent-backend/` with no Next.js imports. Fastify accepts signed asynchronous requests, PostgreSQL persists immutable snapshots and a leased job queue, a bounded orchestrator coordinates independent evaluation, challenge, revision, judging, deterministic policy, and mentoring, and provider adapters isolate Codex, Claude, and deterministic test implementations. OpenAPI is the sole contract with the Next.js client.

**Tech Stack:** Node.js 22+, TypeScript, Fastify, Zod, PostgreSQL, Kysely, pg-boss, Pino, Vitest, Docker, Server-Sent Events.

---

### Task 1: Scaffold the independent backend and test harness

**Files:**
- Create: `agent-backend/package.json`
- Create: `agent-backend/tsconfig.json`
- Create: `agent-backend/vitest.config.ts`
- Create: `agent-backend/eslint.config.mjs`
- Create: `agent-backend/.env.example`
- Create: `agent-backend/src/config.ts`
- Test: `agent-backend/src/config.test.ts`

**Step 1: Write the failing environment test**

```ts
import { describe, expect, it } from "vitest"
import { parseConfig } from "./config.js"

describe("backend configuration", () => {
  it("uses safe private-testing defaults", () => {
    const config = parseConfig({
      NODE_ENV: "test",
      SERVICE_JWT_SECRET: "a".repeat(48),
      DATABASE_URL: "postgres://localhost/traction_agent_test",
    })

    expect(config.provider).toBe("deterministic")
    expect(config.providerConcurrency).toBe(2)
    expect(config.port).toBe(4100)
  })
})
```

**Step 2: Run the test and verify it fails**

Run from `agent-backend/`: `npm test -- src/config.test.ts`  
Expected: FAIL because the project and config parser do not exist.

**Step 3: Create the standalone project**

Add scripts:

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc -p tsconfig.build.json",
  "start": "node dist/server.js",
  "test": "vitest run",
  "test:watch": "vitest",
  "type-check": "tsc --noEmit",
  "lint": "eslint .",
  "db:migrate": "tsx src/db/migrate.ts",
  "worker": "tsx src/worker.ts"
}
```

Use Zod to validate ports, database URL, service JWT secret, active provider,
provider concurrency, timeouts, credential directories, and log level. Never
read provider credentials into a response or loggable object.

**Step 4: Run verification**

Run: `npm test -- src/config.test.ts && npm run type-check && npm run lint`  
Expected: PASS.

**Step 5: Commit**

```bash
git add agent-backend
git commit -m "chore: scaffold standalone agent backend"
```

### Task 2: Define public contracts and service authentication

**Files:**
- Create: `agent-backend/src/contracts/common.ts`
- Create: `agent-backend/src/contracts/runs.ts`
- Create: `agent-backend/src/contracts/events.ts`
- Create: `agent-backend/src/contracts/evals.ts`
- Create: `agent-backend/src/security/service-jwt.ts`
- Test: `agent-backend/src/security/service-jwt.test.ts`

**Step 1: Write the failing JWT scope test**

```ts
it("rejects a founder token for an admin operation", async () => {
  const token = await signer.sign({
    subject: "next-web",
    scopes: ["runs:create"],
    founderId: "founder-1",
  })

  await expect(
    verifier.verify(token, { requiredScope: "admin:runs:read" }),
  ).rejects.toThrow("Insufficient service scope")
})
```

**Step 2: Run the test and verify it fails**

Run: `npm test -- src/security/service-jwt.test.ts`  
Expected: FAIL because contracts and JWT verification do not exist.

**Step 3: Implement contracts and JWT verification**

Define Zod schemas for:

- Mentor message request
- Gate-run request
- Accepted run response
- Run snapshot
- Run event
- Cancellation
- Admin retry and rejudge
- Eval suite execution and result
- Error response

Service JWTs require issuer, audience, subject, organization, scopes, issued
time, expiration no more than five minutes, and a unique token ID. Verify
founder and cohort claims against each request resource.

**Step 4: Run tests**

Run: `npm test -- src/contracts src/security && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add agent-backend/src/contracts agent-backend/src/security
git commit -m "feat: define backend API and service authentication"
```

### Task 3: Model runs, agents, and persistent communication

**Files:**
- Create: `agent-backend/src/domain/types.ts`
- Create: `agent-backend/src/domain/run-state.ts`
- Create: `agent-backend/src/domain/message-board.ts`
- Create: `agent-backend/src/domain/policy.ts`
- Test: `agent-backend/src/domain/run-state.test.ts`
- Test: `agent-backend/src/domain/message-board.test.ts`
- Test: `agent-backend/src/domain/policy.test.ts`

**Step 1: Write failing domain tests**

```ts
it("allows only declared run-state transitions", () => {
  expect(canTransition("independent_evaluation", "challenge_round")).toBe(true)
  expect(canTransition("independent_evaluation", "completed")).toBe(false)
})

it("requires every challenge to target a persisted finding", () => {
  expect(() => board.publish(challengeWithoutTarget)).toThrow(
    "Challenge target does not exist",
  )
})

it("cannot advance without a valid judge result", () => {
  expect(applyDecisionPolicy({ judge: null, findings })).toBe(
    "admin_intervention",
  )
})
```

**Step 2: Run tests and verify they fail**

Run: `npm test -- src/domain`  
Expected: FAIL because the domain does not exist.

**Step 3: Implement the domain**

Define immutable types and Zod schemas for:

- Run state and stage
- Agent role and version
- Findings
- Challenges
- Responses
- Revisions
- Agreements
- Judge questions and results
- Evidence citations
- Provider execution metadata
- Gate decisions

Implement a message board with fixed per-agent message budgets, exactly one
challenge round, exactly one revision round, immutable messages, and target
validation.

Implement a deterministic decision policy that blocks advancement when
required agents are absent, citations are invalid, Judge confidence is below
threshold, or disagreement remains material.

**Step 4: Run tests**

Run: `npm test -- src/domain && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add agent-backend/src/domain
git commit -m "feat: model bounded agent deliberation"
```

### Task 4: Create repository interfaces and in-memory persistence

**Files:**
- Create: `agent-backend/src/repositories/run-repository.ts`
- Create: `agent-backend/src/repositories/in-memory-run-repository.ts`
- Create: `agent-backend/src/repositories/event-repository.ts`
- Create: `agent-backend/src/repositories/in-memory-event-repository.ts`
- Test: `agent-backend/src/repositories/in-memory-run-repository.test.ts`

**Step 1: Write the failing idempotency test**

```ts
it("returns the original run for a duplicate idempotency key", async () => {
  const first = await repository.createRun(snapshot, "same-key")
  const second = await repository.createRun(snapshot, "same-key")

  expect(second.id).toBe(first.id)
  expect(await repository.countRuns()).toBe(1)
})
```

**Step 2: Run the test and verify it fails**

Run: `npm test -- src/repositories/in-memory-run-repository.test.ts`  
Expected: FAIL because repository adapters do not exist.

**Step 3: Implement repository contracts**

Support atomic run creation, state transitions, stage attempts, board messages,
decisions, mentor output, provider sessions, events, cancellation, worker
leases, and audit records.

The in-memory implementation is deterministic and powers unit tests without a
database.

**Step 4: Run tests**

Run: `npm test -- src/repositories && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add agent-backend/src/repositories
git commit -m "feat: add durable run repository contracts"
```

### Task 5: Implement provider abstraction and deterministic agents

**Files:**
- Create: `agent-backend/src/providers/provider.ts`
- Create: `agent-backend/src/providers/provider-errors.ts`
- Create: `agent-backend/src/providers/deterministic-provider.ts`
- Create: `agent-backend/src/agents/registry.ts`
- Create: `agent-backend/src/agents/prompts.ts`
- Test: `agent-backend/src/providers/deterministic-provider.test.ts`

**Step 1: Write the failing communication test**

```ts
it("changes a finding after receiving a valid peer challenge", async () => {
  const initial = await provider.evaluate(problemTask)
  const revised = await provider.revise({
    ...problemTask,
    finding: initial,
    challenges: [contradictoryEvidenceChallenge],
  })

  expect(revised.revisionOf).toBe(initial.id)
  expect(revised.confidence).toBeLessThan(initial.confidence)
})
```

**Step 2: Run the test and verify it fails**

Run: `npm test -- src/providers/deterministic-provider.test.ts`  
Expected: FAIL because providers do not exist.

**Step 3: Implement the provider interface**

Provider methods:

```ts
interface AgentProvider {
  health(): Promise<ProviderHealth>
  evaluate(task: EvaluationTask): Promise<Finding>
  challenge(task: ChallengeTask): Promise<Challenge[]>
  respond(task: ResponseTask): Promise<ResponseMessage>
  revise(task: RevisionTask): Promise<FindingRevision>
  judge(task: JudgeTask): Promise<JudgeResult>
  mentor(task: MentorTask): Promise<MentorResult>
  cancel(executionId: string): Promise<void>
}
```

The deterministic provider must generate reproducible communication from
fixtures and never use a network.

**Step 4: Run tests**

Run: `npm test -- src/providers src/agents && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add agent-backend/src/providers agent-backend/src/agents
git commit -m "feat: add provider-neutral agent interface"
```

### Task 6: Build the deliberation orchestrator

**Files:**
- Create: `agent-backend/src/orchestration/orchestrator.ts`
- Create: `agent-backend/src/orchestration/context-builder.ts`
- Create: `agent-backend/src/orchestration/stages.ts`
- Create: `agent-backend/src/orchestration/budgets.ts`
- Test: `agent-backend/src/orchestration/orchestrator.test.ts`

**Step 1: Write the failing end-to-end deliberation test**

```ts
it("publishes findings, challenges, revisions, judgment, and mentor output", async () => {
  const result = await orchestrator.execute(conflictingGateFixture)

  expect(result.trace.map((message) => message.type)).toEqual(
    expect.arrayContaining([
      "finding",
      "challenge",
      "response",
      "revision",
      "judge_result",
    ]),
  )
  expect(result.decision).toBe("admin_intervention")
  expect(result.mentor.nextAction).toBeTruthy()
})
```

**Step 2: Run the test and verify it fails**

Run: `npm test -- src/orchestration/orchestrator.test.ts`  
Expected: FAIL because orchestration does not exist.

**Step 3: Implement orchestration stages**

Run relevant independent evaluators concurrently. Publish findings only after
the independent stage closes. Run bounded challenges, targeted responses, one
revision, Judge review, deterministic policy, and Mentor synthesis.

Persist every state transition and board message through the repository.
Stages are idempotent and resume by inspecting stored completion state.

**Step 4: Run tests**

Run: `npm test -- src/orchestration && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add agent-backend/src/orchestration
git commit -m "feat: orchestrate structured agent deliberation"
```

### Task 7: Build the Fastify API and resumable SSE

**Files:**
- Create: `agent-backend/src/app.ts`
- Create: `agent-backend/src/server.ts`
- Create: `agent-backend/src/plugins/auth.ts`
- Create: `agent-backend/src/plugins/errors.ts`
- Create: `agent-backend/src/routes/runs.ts`
- Create: `agent-backend/src/routes/admin.ts`
- Create: `agent-backend/src/routes/evals.ts`
- Create: `agent-backend/src/routes/health.ts`
- Create: `agent-backend/src/routes/events.ts`
- Test: `agent-backend/src/routes/runs.test.ts`
- Test: `agent-backend/src/routes/events.test.ts`

**Step 1: Write the failing asynchronous API test**

```ts
it("accepts a signed gate run and returns a resumable event URL", async () => {
  const response = await app.inject({
    method: "POST",
    url: "/v1/gate-runs",
    headers: signedHeaders({ scope: "runs:create" }),
    payload: gateRequestFixture,
  })

  expect(response.statusCode).toBe(202)
  expect(response.json()).toMatchObject({
    state: "queued",
    eventsUrl: expect.stringMatching(/\/events$/),
  })
})
```

**Step 2: Run the test and verify it fails**

Run: `npm test -- src/routes`  
Expected: FAIL because the Fastify app does not exist.

**Step 3: Implement routes**

Register validation, JWT scope checks, idempotency, request IDs, payload limits,
redacted errors, OpenAPI, and graceful shutdown.

SSE emits monotonic event IDs, heartbeat comments, retry hints, and historical
events after `Last-Event-ID` before streaming live events.

**Step 4: Run tests**

Run: `npm test -- src/routes && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add agent-backend/src/app.ts agent-backend/src/server.ts agent-backend/src/plugins agent-backend/src/routes
git commit -m "feat: expose signed agent backend API"
```

### Task 8: Add PostgreSQL storage, queue leases, and workers

**Files:**
- Create: `agent-backend/src/db/types.ts`
- Create: `agent-backend/src/db/client.ts`
- Create: `agent-backend/src/db/migrations/001_initial.ts`
- Create: `agent-backend/src/db/migrate.ts`
- Create: `agent-backend/src/repositories/postgres-run-repository.ts`
- Create: `agent-backend/src/queue/job-queue.ts`
- Create: `agent-backend/src/queue/postgres-job-queue.ts`
- Create: `agent-backend/src/worker.ts`
- Test: `agent-backend/src/queue/job-queue.contract.test.ts`

**Step 1: Write the failing queue contract test**

```ts
it("releases an expired lease for another worker", async () => {
  const job = await queue.enqueue(runId)
  await queue.lease(job.id, "worker-a", shortLease)
  clock.advanceBy(shortLease + 1)

  const recovered = await queue.leaseNext("worker-b")
  expect(recovered?.id).toBe(job.id)
})
```

**Step 2: Run the test and verify it fails**

Run: `npm test -- src/queue/job-queue.contract.test.ts`  
Expected: FAIL because the queue does not exist.

**Step 3: Implement PostgreSQL persistence**

Create tables and indexes for runs, snapshots, stages, jobs, messages,
findings, decisions, provider executions, events, evals, version promotions,
and audit records.

Use `FOR UPDATE SKIP LOCKED` leases, unique idempotency constraints, per-
conversation sequence constraints, delayed retries, and dead-letter state.

The worker heartbeats leases, handles graceful shutdown, and resumes incomplete
stages.

**Step 4: Run tests**

Run with `TEST_DATABASE_URL`: `npm test -- src/queue src/repositories`  
Expected: PASS.

Run: `npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add agent-backend/src/db agent-backend/src/queue agent-backend/src/repositories agent-backend/src/worker.ts
git commit -m "feat: persist and lease multi-agent runs"
```

### Task 9: Add Codex and Claude subscription adapters

**Files:**
- Create: `agent-backend/src/providers/codex-provider.ts`
- Create: `agent-backend/src/providers/claude-provider.ts`
- Create: `agent-backend/src/providers/subscription-health.ts`
- Create: `agent-backend/src/providers/structured-output.ts`
- Test: `agent-backend/src/providers/codex-provider.test.ts`
- Test: `agent-backend/src/providers/claude-provider.test.ts`
- Test: `agent-backend/src/providers/secret-redaction.test.ts`

**Step 1: Write failing adapter tests**

```ts
it("runs Codex in an empty read-only workspace without tools", async () => {
  await provider.evaluate(task)
  expect(fakeCodex.startThread).toHaveBeenCalledWith(
    expect.objectContaining({ sandboxMode: "read-only" }),
  )
})

it("never includes the Claude credential directory in logs", async () => {
  const logs = await runFailingHealthCheck()
  expect(logs).not.toContain(config.claudeConfigDir)
})
```

**Step 2: Run tests and verify they fail**

Run: `npm test -- src/providers/codex-provider.test.ts src/providers/claude-provider.test.ts`  
Expected: FAIL because subscription adapters do not exist.

**Step 3: Implement adapters**

Codex uses `@openai/codex-sdk` with `CODEX_HOME` pointing to the VM credential
mount. Claude uses `@anthropic-ai/claude-agent-sdk` or its local authenticated
Claude Code runtime with a protected configuration directory.

Both adapters:

- Run as the dedicated service user.
- Use an empty per-run workspace.
- Disable tools, writes, arbitrary network access, and approvals.
- Request schema-constrained JSON.
- Keep provider thread/session IDs server-side.
- Redact credentials and local paths.
- Expose redacted health and throttling state.
- Support dependency injection so tests never invoke live providers.

Live smoke tests require `RUN_LIVE_SUBSCRIPTION_TESTS=1`.

**Step 4: Run tests**

Run: `npm test -- src/providers && npm run type-check`  
Expected: PASS without live credentials.

**Step 5: Commit**

```bash
git add agent-backend/src/providers agent-backend/package.json agent-backend/package-lock.json
git commit -m "feat: add private subscription provider adapters"
```

### Task 10: Implement Eval suites, shadow judging, and version promotion

**Files:**
- Create: `agent-backend/src/evals/types.ts`
- Create: `agent-backend/src/evals/fixtures.ts`
- Create: `agent-backend/src/evals/metrics.ts`
- Create: `agent-backend/src/evals/runner.ts`
- Create: `agent-backend/src/evals/promotion.ts`
- Test: `agent-backend/src/evals/runner.test.ts`
- Test: `agent-backend/src/evals/promotion.test.ts`

**Step 1: Write failing Eval tests**

```ts
it("records a shadow verdict without changing the live decision", async () => {
  const result = await evalRunner.shadowJudge(completedRun, shadowProvider)
  expect(result.liveDecision).toBe(completedRun.decision)
  expect(result.shadowDecision).toBeDefined()
})

it("blocks promotion when false-pass rate exceeds threshold", () => {
  expect(canPromote(metricsWithHighFalsePassRate, thresholds)).toBe(false)
})
```

**Step 2: Run tests and verify they fail**

Run: `npm test -- src/evals`  
Expected: FAIL because Eval tooling does not exist.

**Step 3: Implement Eval tooling**

Add strong, weak, contradictory, manipulated, and ambiguous fixtures. Compute
decision agreement, false-pass, false-block, citation validity, unsupported
claims, calibration, provider agreement, latency, and completion metrics.

Store shadow results separately and require configured thresholds before
version promotion.

**Step 4: Run tests**

Run: `npm test -- src/evals && npm run type-check`  
Expected: PASS.

**Step 5: Commit**

```bash
git add agent-backend/src/evals
git commit -m "feat: add judge evaluation and promotion gates"
```

### Task 11: Add scheduling, backpressure, and 100-client load verification

**Files:**
- Create: `agent-backend/src/scheduler/priority-scheduler.ts`
- Create: `agent-backend/src/scheduler/conversation-lock.ts`
- Create: `agent-backend/src/scheduler/provider-circuit.ts`
- Create: `agent-backend/load/sse-100-clients.ts`
- Test: `agent-backend/src/scheduler/priority-scheduler.test.ts`
- Test: `agent-backend/src/scheduler/conversation-lock.test.ts`

**Step 1: Write failing scheduler tests**

```ts
it("prioritizes mentor chat ahead of background Eval work", () => {
  scheduler.enqueue(evalJob)
  scheduler.enqueue(mentorJob)
  expect(scheduler.next()?.id).toBe(mentorJob.id)
})

it("allows different founders in parallel but serializes one conversation", async () => {
  expect(await lock.tryAcquire("conversation-a", "worker-1")).toBe(true)
  expect(await lock.tryAcquire("conversation-a", "worker-2")).toBe(false)
  expect(await lock.tryAcquire("conversation-b", "worker-2")).toBe(true)
})
```

**Step 2: Run tests and verify they fail**

Run: `npm test -- src/scheduler`  
Expected: FAIL because scheduling does not exist.

**Step 3: Implement scheduling and load script**

Add five priority lanes, provider concurrency semaphores, per-conversation
locks, retry-after metadata, circuit breaking, cooldown, queue position, and
graceful backpressure.

The load script opens 100 SSE clients, submits deterministic-provider work,
reconnects a percentage of clients, and verifies no lost or duplicated final
events.

**Step 4: Run tests and load check**

Run: `npm test -- src/scheduler`  
Expected: PASS.

Run against a local server: `npm run load:sse`  
Expected: 100 connected clients, 100 terminal results, zero duplicate results.

**Step 5: Commit**

```bash
git add agent-backend/src/scheduler agent-backend/load agent-backend/package.json
git commit -m "feat: add bounded parallel scheduling"
```

### Task 12: Package VM deployment and verify the complete backend

**Files:**
- Create: `agent-backend/Dockerfile`
- Create: `agent-backend/docker-compose.yml`
- Create: `agent-backend/.dockerignore`
- Create: `agent-backend/deploy/traction-agent.service`
- Create: `agent-backend/deploy/Caddyfile.example`
- Create: `agent-backend/scripts/provider-login-check.sh`
- Create: `agent-backend/README.md`
- Create: `agent-backend/docs/gcp-vm-deployment.md`
- Create: `agent-backend/docs/private-subscription-auth.md`
- Create: `agent-backend/docs/api-integration.md`
- Create: `agent-backend/docs/operations.md`

**Step 1: Run the complete test suite**

Run from `agent-backend/`: `npm test`  
Expected: All non-live tests pass.

Run: `npm run type-check`  
Expected: No TypeScript errors.

Run: `npm run lint`  
Expected: No ESLint errors.

Run: `npm run build`  
Expected: A clean `dist/` build.

**Step 2: Build the container**

Run: `docker build -t traction-agent-backend:test .`  
Expected: Successful multi-stage image build with no credential files.

**Step 3: Verify container and Compose health**

Run: `docker compose up --build`  
Expected: API and PostgreSQL become healthy; deterministic provider reports
ready.

**Step 4: Verify security and recovery**

Confirm:

- Provider credential directories are runtime mounts.
- Image history contains no secrets.
- Logs redact paths and tokens.
- Invalid service JWTs fail.
- Worker restart resumes leased jobs.
- SSE resumes after disconnect.
- Database migration is repeatable.

**Step 5: Commit**

```bash
git add agent-backend
git commit -m "docs: package agent backend for private VM testing"
```

### Task 13: Publish the client contract for Next.js

**Files:**
- Create: `agent-backend/scripts/export-openapi.ts`
- Create: `lib/agent-backend/client.ts`
- Create: `lib/agent-backend/contracts.ts`
- Create: `app/api/agent/runs/route.ts`
- Create: `app/api/agent/runs/[id]/route.ts`
- Create: `app/api/agent/runs/[id]/events/route.ts`
- Test: `lib/agent-backend/client.test.ts`

**Step 1: Write the failing client contract test**

```ts
it("signs and submits an idempotent gate run", async () => {
  const response = await client.createGateRun(request, {
    idempotencyKey: "submission-1",
  })

  expect(fetchSpy).toHaveBeenCalledWith(
    expect.stringContaining("/v1/gate-runs"),
    expect.objectContaining({
      headers: expect.objectContaining({
        "idempotency-key": "submission-1",
      }),
    }),
  )
  expect(response.state).toBe("queued")
})
```

**Step 2: Run the test and verify it fails**

Run from repository root: `npm test -- lib/agent-backend/client.test.ts`  
Expected: FAIL because the client does not exist.

**Step 3: Export OpenAPI and build the proxy**

Generate stable TypeScript contracts from backend OpenAPI. The Next.js proxy
signs short-lived service JWTs, forwards idempotency keys, validates returned
data, and proxies resumable SSE without exposing backend credentials.

**Step 4: Run both project suites**

Run from `agent-backend/`: `npm test && npm run type-check && npm run build`  
Expected: PASS.

Run from repository root: `npm test && npm run type-check && npm run build`  
Expected: PASS.

**Step 5: Commit**

```bash
git add agent-backend/scripts lib/agent-backend app/api/agent
git commit -m "feat: connect Next.js to standalone agent backend"
```
