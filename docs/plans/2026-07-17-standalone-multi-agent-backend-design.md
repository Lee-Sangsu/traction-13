# Standalone Multi-Agent Backend Design

**Status:** Approved  
**Date:** 2026-07-17  
**Runtime:** TypeScript and Node.js  
**HTTP framework:** Fastify  
**Initial deployment:** Private Google Cloud VM  
**Initial model authentication:** Codex or Claude subscription credentials stored only on the trusted VM

## 1. Purpose

The Traction 13 multi-agent system will run as a standalone backend service
independent from the Next.js application. The service evaluates founder
evidence, deliberates across specialized agents, issues auditable soft-gate
decisions, produces mentor guidance, and continuously evaluates its own
decision quality during testing.

The Next.js application is a client of the backend. It does not execute agents,
possess provider credentials, or import backend implementation code.

The initial private-testing deployment uses either Codex or Claude subscription
authentication on a trusted Google Cloud VM. The architecture keeps provider
access behind an adapter so the service can later move to API keys, Vertex AI,
or workload identity without changing the orchestration or public API.

## 2. Service boundary

The backend lives under `agent-backend/` as an independently installable and
deployable TypeScript project. It has its own:

- `package.json`
- TypeScript configuration
- Test configuration
- Environment schema
- Database migrations
- Dockerfile
- Docker Compose development stack
- Operational scripts
- Deployment documentation

The service does not import Next.js modules. Shared behavior is expressed
through versioned HTTP contracts and an OpenAPI-generated TypeScript client.

## 3. Primary components

### 3.1 Fastify API

Accepts authenticated mentor messages and gate evaluation snapshots, returns
run identifiers, exposes current state and final results, streams resumable
events, and provides administrative and health operations.

### 3.2 Run coordinator

Validates and stores an immutable request snapshot, enforces idempotency,
creates a durable run, and schedules the first stage.

### 3.3 Durable PostgreSQL queue

Stores queued jobs, delayed retries, worker leases, attempts, cancellations,
and dead-letter state. PostgreSQL is the only required infrastructure service
for the initial deployment; Redis is not required.

### 3.4 Deliberation orchestrator

Runs the bounded multi-agent state machine, controls concurrency and stage
dependencies, publishes shared-board messages, and resumes interrupted runs.

### 3.5 Agent registry

Stores versioned configurations for:

- Evidence Agent
- Problem Agent
- Offer Agent
- Sales Agent
- Consistency Agent
- Mentor Agent
- Journey Agent
- Judge Agent
- Orchestrator

Each configuration records system instructions, provider, model, response
schema, tool policy, token budget, timeout, and active version.

### 3.6 Provider adapters

Codex and Claude implementations conform to one interface. The adapter is
responsible for:

- Provider authentication health
- Starting or resuming a provider session
- Supplying bounded context
- Enforcing tool restrictions
- Request timeout
- Structured response validation
- Usage and throttling metadata
- Cancellation where supported

The deterministic provider remains available for tests and local development.

### 3.7 Shared run board

The shared run board is the only communication channel between agents.
Messages are persisted and agents receive board snapshots rather than direct
in-process references. This makes runs reproducible, auditable, resumable, and
safe across worker restarts.

### 3.8 Judge process

The live Judge reviews the complete deliberation trace. It evaluates evidence
sufficiency, argument quality, unresolved disagreement, groupthink, citation
quality, confidence calibration, and gate-policy compliance.

The Judge cannot introduce new evidence. Its output remains a recommendation
to a deterministic policy engine, which produces the externally visible gate
decision.

### 3.9 Evaluation process

The Eval process is isolated from live decisions. It runs fixtures, historical
replays, shadow judgments, provider comparisons, and prompt/model regression
tests. Eval results determine whether an agent or prompt version is eligible
for promotion.

## 4. Structured deliberation protocol

### 4.1 State machine

A live gate run moves through:

1. `queued`
2. `snapshotting`
3. `independent_evaluation`
4. `challenge_round`
5. `revision_round`
6. `judging`
7. `decision_policy`
8. `mentoring`
9. `completed`

Terminal alternatives:

- `admin_review`
- `failed`
- `cancelled`

### 4.2 Independent evaluation

Only evaluator agents relevant to the current mission run. They receive the
immutable founder snapshot and curriculum configuration but cannot see peer
conclusions. This reduces anchoring.

### 4.3 Publication

Initial findings are published to the shared run board after all required
independent evaluators finish or exhaust their retry policy.

### 4.4 Challenge round

Agents inspect peer findings and can issue targeted challenges about:

- Missing or misused evidence
- Contradictory claims
- Methodological errors
- Unsupported confidence
- Problem, offer, or sales semantics
- Proposed next-action safety or feasibility

Each agent has a fixed message and token budget.

### 4.5 Response and revision

A challenged agent must answer the challenge. It may publish one revised
finding. Original findings remain immutable. One challenge round and one
revision round are allowed in the initial version.

### 4.6 Judge review

The Judge receives the original snapshot and complete communication trace. It
returns a schema-validated judgment with:

- Recommended decision
- Confidence
- Evidence citations
- Unresolved disagreements
- Groupthink risk
- Unsupported conclusions
- Required admin review
- Recommended mentor emphasis

### 4.7 Deterministic decision policy

Code translates the Judge result and configured program policy into:

- `advance`
- `revise`
- `validate_more`
- `redirect`
- `accelerate`
- `admin_intervention`

A missing required evaluator, missing Judge output, invalid citations, or
material unresolved conflict cannot produce `advance`.

### 4.8 Mentor synthesis

The Mentor receives the final decision, approved findings, and Judge emphasis.
It produces a concise Spanish explanation and one concrete next action. It
cannot alter the gate decision or introduce unsupported evidence.

## 5. Inter-agent message contract

Every message contains:

- Message ID
- Run ID
- Deliberation round
- Sender
- Recipient or broadcast audience
- Message type
- Target finding or claim
- Structured argument
- Evidence references
- Confidence
- Requested response
- Prompt version
- Model and provider
- Creation timestamp

Supported message types:

- `finding`
- `challenge`
- `response`
- `revision`
- `agreement`
- `judge_question`
- `judge_result`

Free-form unbounded agent conversations are not allowed.

## 6. Live Judge and offline Eval

### 6.1 Live Judge

Every live gate uses a Judge. The Judge is part of the founder-facing run and
must finish before the deterministic decision policy executes.

### 6.2 Shadow Judge

A run can optionally execute a second provider or prompt version as a shadow
Judge. The shadow verdict is stored but cannot affect the founder.

During private testing, supported configurations include:

- Codex evaluators with a Claude shadow Judge
- Claude evaluators with a Codex shadow Judge
- Same provider with different Judge prompt versions

### 6.3 Eval datasets

Eval suites contain:

- Strong evidence cases
- Weak evidence cases
- Contradictory cases
- Manipulated or suspicious evidence cases
- Ambiguous cases
- Admin-labeled historical runs

### 6.4 Eval metrics

The platform records:

- Agreement with expected decision
- False-pass rate
- False-block rate
- Citation validity
- Unsupported-claim rate
- Confidence calibration
- Judge/evaluator disagreement
- Provider agreement
- Latency
- Usage
- Completion and failure rate

### 6.5 Version promotion

Agent, prompt, policy, and model configurations are immutable versions. A
version must pass configured Eval thresholds before an administrator can
promote it to active.

## 7. Parallelism and 100 concurrent users

The system supports 100 simultaneous live connections with safely queued
parallel processing. It does not promise 100 simultaneous model calls while
using one subscription identity.

### 7.1 Processing lanes

From highest to lowest priority:

1. Active mentor conversations
2. Founder soft-gate evaluations
3. Administrator-triggered replays
4. Shadow Judges
5. Offline Eval batches

### 7.2 Concurrency rules

- Fastify accepts requests quickly and returns `202 Accepted`.
- Different founders can process concurrently.
- Messages within one founder conversation remain ordered.
- Independent evaluator agents can run in parallel.
- Challenge work fans out only to addressed agents.
- Judge and Mentor stages wait for dependencies.
- Provider concurrency is globally bounded and configurable.
- Subscription cooldowns and daily-use limits are respected.
- Idempotency collapses duplicate requests.

### 7.3 Backpressure

When provider capacity is full, jobs remain durable. Clients receive queue
state, position, and resumable progress rather than a dropped request.

### 7.4 Future horizontal scale

The stateless API and leased workers can later run as multiple processes or
instances. PostgreSQL coordinates leases and ordering. Reusing one personal
subscription identity across many machines is not an approved scaling method;
production scale will use an API or workload identity credential mode.

## 8. Public HTTP API

### 8.1 Founder operations

- `POST /v1/conversations/:id/messages`
- `POST /v1/gate-runs`
- `GET /v1/runs/:id`
- `GET /v1/runs/:id/events`
- `POST /v1/runs/:id/cancel`

All mutation endpoints require an idempotency key. Accepted asynchronous work
returns `202` with a run ID and event URL.

### 8.2 Administrative and Eval operations

- `GET /v1/admin/runs/:id/trace`
- `POST /v1/admin/runs/:id/retry`
- `POST /v1/admin/runs/:id/rejudge`
- `POST /v1/evals/suites/:id/run`
- `GET /v1/evals/runs/:id`
- `POST /v1/evals/versions/:id/promote`

### 8.3 Health operations

- `GET /health/live`
- `GET /health/ready`
- `GET /health/providers`

### 8.4 Events

Server-Sent Events publish:

- Run state transitions
- Queue state
- Stage progress
- Agent publication
- Challenge and response activity
- Judge completion
- Mentor completion
- Final result
- Retryable and terminal errors

Clients resume with `Last-Event-ID`.

## 9. Next.js integration

Next.js signs short-lived service JWTs and proxies founder and administrator
requests. Public browsers never receive backend or provider credentials.

The backend publishes OpenAPI. A generated TypeScript client provides typed
requests and responses without exposing backend implementation.

## 10. Persistence

PostgreSQL stores:

- Conversations and ordered messages
- Immutable input snapshots
- Runs, stages, attempts, leases, and cancellations
- Findings and revisions
- Inter-agent messages and citations
- Judge results and deterministic decisions
- Mentor outputs
- Provider session identifiers
- Usage, latency, throttling, and failure records
- Eval suites, cases, results, and version promotions
- Append-only audit events

## 11. Private subscription authentication

### 11.1 VM identity

The service runs under a dedicated unprivileged Linux user.

### 11.2 Credential storage

Codex and Claude have separate credential directories with `0700` permissions.
The directories are mounted at runtime and never included in:

- Source control
- Container images
- Application logs
- Database records
- HTTP responses
- Next.js environment variables

### 11.3 Provider health

The service verifies provider authentication on startup and exposes a redacted
health state. Expired authentication pauses provider work and alerts the
operator. It never attempts an automated browser login.

### 11.4 Tool isolation

Evaluator, Judge, Mentor, and Journey runs receive no shell, filesystem,
browser, or arbitrary network tools. They operate only on structured snapshots
and shared-board messages.

## 12. Service authentication and data security

- Next.js uses short-lived service JWTs.
- Founder and administrator scopes are distinct.
- Requests include organization, cohort, founder, and conversation context.
- The backend enforces resource access independent of Next.js.
- Request sizes and attachment references are bounded.
- Logs redact tokens, credentials, customer PII, and raw evidence bodies.
- All traffic uses TLS.
- Database backups and disks are encrypted.
- Provider egress is allowlisted where deployment controls support it.

## 13. Failure handling

- Provider throttling uses exponential backoff, jitter, and a circuit breaker.
- Worker crashes recover through expired leases.
- SSE disconnects do not cancel runs.
- Invalid output receives one bounded repair attempt.
- Agents retry independently without repeating completed stages.
- Missing required evaluator or Judge results block a pass.
- Exhausted runs enter dead-letter and admin-review state.
- Cancellation prevents unscheduled stages and records partial work.
- Database outages pause leasing and resume after connectivity returns.
- Authentication failures pause the provider queue and surface operator action.

## 14. Google Cloud VM deployment

The backend includes:

- Multi-stage Dockerfile
- Docker Compose development stack
- Environment template
- Migration command
- Health checks
- Graceful shutdown
- Systemd service example
- Reverse proxy and TLS guidance
- Firewall and VM hardening guidance
- Persistent disk and backup guidance
- Subscription credential login and mount instructions
- Structured Pino logging
- Prometheus-compatible metrics

## 15. Verification strategy

- Unit tests for the state machine, scheduler, message budgets, policy engine,
  and communication protocol
- Request and response schema tests
- OpenAPI contract tests
- PostgreSQL queue, lease, retry, ordering, cancellation, and idempotency tests
- Mock Codex and Claude adapter tests
- Opt-in live subscription smoke tests excluded from ordinary CI
- Eval fixture and shadow-Judge tests
- Load tests with 100 SSE clients and safely queued work
- Worker-kill and database-reconnect tests
- Rate-limit, malformed-output, and expired-auth tests
- Service JWT and authorization tests
- Cross-founder isolation tests
- Prompt-injection and oversized-payload tests
- Secret-redaction tests

## 16. Initial success criteria

The backend is ready for private testing when:

- It runs independently from Next.js.
- A signed request creates an idempotent durable run.
- Relevant agents publish independent findings.
- Agents challenge, answer, and revise through the shared board.
- The Judge produces a cited structured result.
- Deterministic policy produces the final gate decision.
- The Mentor returns one Spanish next action.
- Runs resume after worker or client interruption.
- One hundred clients can remain connected while provider work is safely
  queued.
- Codex or Claude subscription authentication remains confined to the VM.
- Eval suites can compare provider and prompt versions without changing live
  decisions.
