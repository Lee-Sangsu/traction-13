# Traction 13 Program Platform Design

**Status:** Approved  
**Date:** 2026-07-17  
**Product language:** Spanish  
**Initial roles:** Founders and administrators

## 1. Product intent

Traction 13 is a production entrepreneurship program management platform for
young founders in Bogota. It turns a time-bounded entrepreneurship curriculum
into a guided execution system.

The product is not primarily a course library. It pushes founders to collect
external evidence, make decisions, expose an offer to the market, and make real
sales asks. An LLM mentor accompanies the founder throughout the journey, while
multi-agent soft gates evaluate evidence and determine the most useful next
action.

The first canonical program is the Traction 13 curriculum. Administrators can
clone and version it to create programs with different durations, activities,
and intended outcomes. All programs retain three simple core outcome
dimensions:

- Problem outcome
- Offer outcome
- Sales outcome

Revenue is the strongest sales signal, but it is not mandatory for program
completion. Completion is based on action quality, external evidence, learning,
and a final admin-confirmed submission.

## 2. Product principles

1. **Action over consumption.** Each day centers on a field mission rather
   than content completion.
2. **Evidence over claims.** AI-generated artifacts, unsupported statements,
   and simulated activity cannot count as customer or sales validation.
3. **One useful next action.** The mentor should reduce uncertainty and push
   the founder toward the smallest meaningful next step.
4. **Soft gates, not rigid walls.** Agents can pass, revise, redirect, or
   accelerate work, and administrators can override every decision.
5. **Human accountability.** High-impact actions and final completion require
   administrative authority.
6. **Auditable AI.** Every evaluation cites source evidence and records prompt,
   model, rubric, confidence, disagreement, cost, and latency.
7. **Immutable program delivery.** Active cohorts use a fixed program version.
   Editing a template creates a new version rather than changing live journeys.
8. **Spanish-first simplicity.** The production interface and curriculum are
   Spanish only in the initial release.

## 3. Roles and collaboration

### 3.1 Founder

Every participant joins with an individual account. Founders can complete the
program alone or form an optional venture team after joining.

Personal history, reflections, and account data remain individual. A founder
can choose which venture artifacts become shared with a team. Leaving a team
does not erase personal journey history.

### 3.2 Administrator

Administrators operate programs and cohorts, manage participants, configure
templates, monitor agent performance, intervene in difficult cases, and confirm
final completion.

The first release does not include separate human mentor or judge roles.

## 4. Operating model

Every founder moves through a shared cohort rhythm while receiving adaptive
work based on evidence and current problem, offer, and sales maturity.

The core loop is:

1. The platform presents a daily mission.
2. The founder takes action outside the platform.
3. The founder uploads structured evidence and reflection.
4. A multi-agent soft gate evaluates the submission.
5. The orchestrator issues one decision.
6. The mentor explains the decision and pushes the founder to the next action.

Possible decisions are:

- **Avanzar:** Evidence is sufficient for the next dependent mission.
- **Revisar:** The current artifact needs improvement.
- **Validar mas:** Additional external evidence is required.
- **Redirigir:** Current assumptions are contradicted or poorly framed.
- **Acelerar:** Preparation is redundant and the founder should attempt a
  stronger market action.
- **Intervencion administrativa:** Risk, ambiguity, repeated failure,
  manipulation, or exceptional circumstances require human review.

The founder may explore unlocked areas while an evaluation runs. Activities
that depend on the decision remain locked until the soft gate resolves.

## 5. Outcome model

Outcome states are operational signals used to choose the next action. They
are not a traditional taxonomy or certification system.

### 5.1 Problem

The system asks whether the problem is specific, important, evidenced, and
attached to a reachable customer.

Operational states:

- Untested
- Explored
- Evidenced
- Focused

### 5.2 Offer

The system asks whether the offer is clear, relevant, credible, priced, and
easy to act on.

Operational states:

- Absent
- Drafted
- Exposed
- Understood
- Compelling

### 5.3 Sales

The system asks whether the founder made real asks, captured responses,
learned from objections, and generated meaningful commitments or revenue.

Operational states:

- No asks
- Asks made
- Responses captured
- Commitment
- Revenue

## 6. Traction 13 canonical workflow

### Day 1: Define tu punto de partida

- Capture motivation, capabilities, constraints, interests, and initial idea.
- Establish a founder baseline.
- Identify unsupported assumptions.

### Day 2: Elige como avanzar

- Capture solo or team preference, collaboration profile, and commitment.
- Recommend staying solo or meeting compatible founders.
- Support optional team formation.

### Day 3: Encuentra un problema real

- Define a customer hypothesis, context, observed pain, and alternatives.
- Evaluate problem specificity and testability.

### Day 4: Sal del edificio

- Create an interview plan, participant criteria, outreach list, and script.
- Detect biased questions and weak customer access.

### Day 5: Escucha evidencia

- Upload interview records, notes, quotes, recordings, attachments, and
  reflections.
- Verify conversations and identify recurring signals.

### Day 6: Decide que problema merece atencion

- Synthesize evidence, contradictions, rejected assumptions, and a focused
  problem statement.
- Approve the problem outcome, redirect discovery, or require more evidence.

### Day 7: Construye una oferta comprable

- Define the promise, customer, format, scope, price, credibility, and call to
  action.
- Evaluate clarity, relevance, credibility, and purchase friction.

### Day 8: Pon la oferta en el mundo

- Publish a page, post, message, menu, or proposal with a reachable call to
  action.
- Confirm that a real customer can encounter and accept the offer.

### Day 9: Haz pedidos reales

- Submit a lead list, outreach messages, real sales asks, and responses.
- Reject simulated activity and require genuine asks to reachable people.

### Day 10: Aprende de las objeciones

- Capture conversations, objections, losses, interest signals, and a revised
  offer.
- Distinguish a messaging issue from a problem or offer issue.

### Day 11: Vende otra vez

- Run a second sales cycle with follow-ups, a price test, and commitment or
  payment evidence.
- Evaluate improvement between attempts and update the sales outcome.

### Day 12: Convierte accion en traccion

- Build a traction report, evidence index, metrics, lessons, and pitch draft.
- Audit every material claim against evidence.

### Day 13: Demuestra y continua

- Submit a final pitch, outcome summary, and 30-day action plan.
- Produce the final multi-agent evaluation.
- Require an administrator to confirm completion.

Activities may overlap. Strong founders can begin interviews or sales earlier.
The Journey Agent can assign recovery work or acceleration without breaking the
shared cohort rhythm.

## 7. Daily activity structure

Each program day can contain:

1. Short context lesson
2. Primary field mission
3. Optional mentor preparation
4. Structured evidence requirements
5. Founder reflection
6. Multi-agent evaluation
7. Personalized next-step decision
8. Deadline and recovery path

The modular template model stores phases, days, activities, dependencies,
evidence schemas, rubrics, agent composition, deadlines, and completion rules.

## 8. Multi-agent evaluation system

Each soft gate activates only the agents relevant to the submission.

### 8.1 Evidence Agent

- Verifies whether submitted evidence is external, attributable, timely, and
  relevant.
- Separates evidence from founder interpretation and AI-generated content.
- Flags missing sources, duplicated material, suspicious patterns, and
  unverifiable claims.

### 8.2 Problem Agent

- Evaluates customer specificity, problem importance, frequency, context,
  current alternatives, reachability, and strength of support.
- Identifies premature solution framing and interview bias.

### 8.3 Offer Agent

- Evaluates target fit, promise, scope, format, price, credibility, call to
  action, and purchase friction.
- Compares offer revisions with observed customer responses.

### 8.4 Sales Agent

- Evaluates whether real asks occurred.
- Distinguishes outreach, interest, objection, commitment, payment, and
  revenue.
- Reviews response quality and learning across sales cycles.

### 8.5 Consistency Agent

- Compares current claims with prior submissions, evidence, venture artifacts,
  and outcome history.
- Surfaces contradictions, unsupported narrative changes, and stale context.

### 8.6 Mentor Agent

- Translates evaluation findings into supportive but demanding coaching.
- Asks targeted reflective questions.
- Prepares the founder for field action without fabricating evidence or doing
  the founder's validation work.
- Produces a concise next-step explanation in Spanish.

### 8.7 Journey Agent

- Selects the next mission, revision, recovery task, redirect, acceleration, or
  escalation.
- Respects program dependencies, cohort deadlines, admin exceptions, and the
  current outcome state.

### 8.8 Orchestrator

- Creates an immutable context snapshot for the run.
- Dispatches relevant agents concurrently or sequentially.
- Validates structured results.
- Resolves disagreement using configured rubric priorities.
- Produces one explainable soft-gate decision with confidence and citations.
- Escalates low-confidence and high-impact decisions.

## 9. Founder application

The authenticated founder application lives under `/app` and includes:

- Onboarding and baseline
- Today dashboard
- Thirteen-day journey
- Evidence studio
- Problem workspace
- Offer builder and version history
- Sales pipeline
- Contextual LLM mentor
- Traction report
- Pitch builder
- Optional team discovery and invitations
- Notifications
- Profile, privacy, export, and deletion settings

The Today dashboard prioritizes one primary mission with its purpose, expected
evidence, estimated effort, deadline, gate status, and mentor guidance.

## 10. Administrator application

The administrator application lives under `/admin` and includes:

- Cohort command center
- Participant management
- Cohort and schedule management
- Versioned program template studio
- Protected Traction 13 canonical template
- Agent runs and operations
- Intervention inbox
- Override controls with mandatory reasons
- Content library
- Problem, offer, and sales analytics
- Cohort and participant exports
- Admin accounts, model settings, budgets, retention, and audit logs

## 11. Product boundaries

The first production version excludes:

- Public social feed
- Separate human mentor accounts
- Judge accounts
- Investment matching
- Full CRM automation
- Customer payment processing
- Unrestricted autonomous web actions

Founders can record external payments and attach evidence.

## 12. Technical architecture

### 12.1 Web application

- Next.js App Router and TypeScript
- Existing public landing page at `/`
- Authenticated founder application at `/app`
- Authenticated administrator application at `/admin`
- Spanish interface copy
- shadcn/ui and the existing Traction 13 Tailwind brand system

### 12.2 Supabase

Supabase provides:

- Authentication
- PostgreSQL
- Row Level Security
- Private file storage
- Realtime status updates
- Database functions and migrations
- Durable Postgres-native evaluation queue

### 12.3 Agent worker

Long-running multi-agent evaluations execute in a dedicated worker rather than
inside a browser or one request-bound Edge Function.

Submission flow:

1. Store the submission and immutable evidence snapshot.
2. Create a gate run with a unique idempotency key.
3. Enqueue a durable evaluation message.
4. Load exact program, rubric, prompt, model, and context versions.
5. Dispatch relevant evaluator agents.
6. Run consistency and mentoring synthesis.
7. Reconcile findings through the orchestrator.
8. Store the decision and all cited findings transactionally.
9. Update journey, intervention, outcome, and notification state.
10. Push the new state to founder and administrator interfaces.

### 12.4 LLM abstraction

The agent layer uses a provider abstraction so program configuration and stored
evaluation history are not coupled to one model vendor. Every agent returns
schema-validated structured data.

## 13. Data domains

- Identity
- Organizations and admin memberships
- Program templates and immutable versions
- Phases, days, activities, resources, and evidence schemas
- Gate definitions, rubrics, prompts, and agent configurations
- Cohorts, schedules, enrollments, announcements, and exceptions
- Ventures, teams, invitations, and shared artifacts
- Journey instances, submissions, recovery tasks, and unlocks
- Evidence items, files, links, interviews, consent, and extracted claims
- Problem hypotheses and outcome snapshots
- Offer versions and exposure evidence
- Leads, sales asks, responses, objections, commitments, and revenue events
- Agent runs, steps, findings, citations, confidence, cost, and failures
- Mentor conversations, summaries, and recommendations
- Interventions, overrides, notifications, exports, and audit events

## 14. Authorization and privacy

- Founders access only their personal records and explicitly shared team
  artifacts.
- Administrators are scoped by organization and cohort.
- Every exposed table and storage path uses Row Level Security.
- Worker credentials remain server-only.
- Evidence files use private storage and short-lived signed access.
- Sensitive customer data is minimized and can be redacted before processing.
- Agent context contains only data needed for the current task.
- Administrators can inspect every evaluation and override.
- Retention and deletion separate personal data from anonymized analytics.

## 15. Reliability and error handling

- Store founder submissions before starting agent work.
- Retry failed steps independently with bounded attempts.
- Validate all agent outputs and repair or retry invalid responses.
- Move exhausted jobs to an admin-visible dead-letter state.
- Use idempotency to prevent duplicate decisions.
- Escalate low-confidence or materially disagreeing evaluations.
- Preserve work during LLM provider outages and resume later.
- Publish gate decisions and journey changes in one transaction.
- Show clear founder-visible processing and failure states.

## 16. Verification strategy

- Database migration and constraint tests
- Row Level Security tests for every role boundary
- Unit tests for progression, recovery, deadlines, overrides, and outcome state
- Contract tests for every agent response schema
- Deterministic fixtures for strong, weak, contradictory, suspicious, and
  ambiguous evidence
- Agent evaluation tests against administrator-reviewed decisions
- End-to-end founder and administrator workflows
- Queue retry and idempotency tests
- Accessibility and responsive layout checks
- Type checking, linting, and production build verification
- Cost, latency, confidence, and disagreement monitoring

## 17. Success criteria

The initial system is successful when:

- A founder can register, join a cohort, and complete all thirteen days.
- Every core mission accepts structured evidence.
- Every meaningful submission produces an auditable multi-agent decision.
- The mentor clearly pushes the founder toward the next useful field action.
- Administrators can identify risk, inspect evaluations, intervene, and
  override decisions.
- Traction 13 can be cloned into a new immutable program version.
- Problem, offer, and sales outcomes remain traceable to source evidence.
- Founder and team data are correctly isolated.
- Failed evaluations recover without losing founder work.
