export type OutcomeDimension = "problem" | "offer" | "sales"

export type ProblemState = "untested" | "explored" | "evidenced" | "focused"
export type OfferState =
  | "absent"
  | "drafted"
  | "exposed"
  | "understood"
  | "compelling"
export type SalesState =
  | "no_asks"
  | "asks_made"
  | "responses_captured"
  | "commitment"
  | "revenue"

export type OutcomeStateMap = {
  problem: ProblemState
  offer: OfferState
  sales: SalesState
}

export type AgentRole =
  | "evidence"
  | "problem"
  | "offer"
  | "sales"
  | "consistency"
  | "mentor"
  | "journey"
  | "orchestrator"

export type GateDecision =
  | "advance"
  | "revise"
  | "validate_more"
  | "redirect"
  | "accelerate"
  | "admin_intervention"

export type EvidenceType =
  | "reflection"
  | "document"
  | "link"
  | "customer_conversation"
  | "published_offer"
  | "sales_ask"
  | "commitment"
  | "payment"

export type EvidenceRequirement = {
  id: string
  label: string
  description: string
  type: EvidenceType
  minimumCount?: number
}

export type ProgramPhase = "foundation" | "problem" | "offer" | "sales" | "showcase"

export type ProgramDay = {
  id: string
  number: number
  phase: ProgramPhase
  title: string
  summary: string
  mission: string
  outcomeFocus: OutcomeDimension[]
  evidenceRequirements: EvidenceRequirement[]
  activeAgents: AgentRole[]
  estimatedMinutes: number
  dependsOn: number[]
  deadlineLabel: string
}

export type ProgramTemplate = {
  id: string
  name: string
  version: number
  status: "draft" | "active" | "archived"
  language: "es"
  durationDays: number
  description: string
  days: ProgramDay[]
}

export type Founder = {
  id: string
  name: string
  email: string
  avatarInitials: string
  city: string
  ventureName: string
  ventureSummary: string
  mode: "solo" | "team"
  joinedAt: string
}

export type Cohort = {
  id: string
  name: string
  templateId: string
  templateVersion: number
  timezone: string
  startsAt: string
  endsAt: string
  participantCount: number
  activeDay: number
}

export type JourneyDayStatus =
  | "completed"
  | "active"
  | "locked"
  | "revision"
  | "accelerated"

export type JourneyDay = {
  dayNumber: number
  status: JourneyDayStatus
  attempts: number
  decision?: GateDecision
  completedAt?: string
}

export type FounderJourney = {
  id: string
  founderId: string
  cohortId: string
  currentDay: number
  unlockedThrough: number
  streak: number
  outcomeStates: OutcomeStateMap
  days: JourneyDay[]
}

export type EvidenceItem = {
  id: string
  founderId: string
  dayNumber: number
  type: EvidenceType
  title: string
  summary: string
  sourceName?: string
  sourceUrl?: string
  occurredAt: string
  status: "draft" | "submitted" | "verified" | "questioned"
  tags: string[]
}

export type OfferVersion = {
  id: string
  founderId: string
  version: number
  customer: string
  promise: string
  format: string
  priceCop: number
  callToAction: string
  status: "draft" | "published" | "revised"
  publishedUrl?: string
  createdAt: string
}

export type SalesEvent = {
  id: string
  founderId: string
  contactName: string
  company?: string
  kind: "ask" | "response" | "objection" | "commitment" | "revenue"
  summary: string
  amountCop?: number
  occurredAt: string
  evidenceId?: string
}

export type AgentFinding = {
  agent: AgentRole
  verdict: "strong" | "mixed" | "weak" | "not_applicable"
  confidence: number
  summary: string
  evidenceIds: string[]
  concerns: string[]
  recommendedActions: string[]
}

export type AgentRun = {
  id: string
  founderId: string
  dayNumber: number
  status: "queued" | "running" | "completed" | "failed" | "needs_review"
  decision?: GateDecision
  confidence?: number
  disagreement?: number
  startedAt: string
  completedAt?: string
  latencyMs?: number
  costUsd?: number
  findings: AgentFinding[]
}

export type Intervention = {
  id: string
  founderId: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  createdAt: string
  status: "open" | "in_review" | "resolved"
  reason:
    | "low_confidence"
    | "evidence_conflict"
    | "repeated_revision"
    | "inactivity"
    | "suspected_manipulation"
    | "founder_request"
}
