import { z } from "zod"

import type { ProgramDay } from "@/lib/traction/types"

export const agentRoleSchema = z.enum([
  "evidence",
  "problem",
  "offer",
  "sales",
  "consistency",
  "mentor",
  "journey",
  "orchestrator",
])

export const agentFindingSchema = z.object({
  agent: agentRoleSchema,
  verdict: z.enum(["strong", "mixed", "weak", "not_applicable"]),
  confidence: z.number().min(0).max(1),
  summary: z.string().min(1),
  evidenceIds: z.array(z.string()),
  concerns: z.array(z.string()),
  recommendedActions: z.array(z.string()),
})

export const gateDecisionSchema = z.enum([
  "advance",
  "revise",
  "validate_more",
  "redirect",
  "accelerate",
  "admin_intervention",
])

export const orchestratedGateResultSchema = z.object({
  gateRunId: z.string().min(1),
  decision: gateDecisionSchema,
  confidence: z.number().min(0).max(1),
  disagreement: z.number().min(0).max(1),
  mentorMessage: z.string().min(1),
  nextAction: z.string().min(1),
  findings: z.array(agentFindingSchema),
  steps: z.array(agentFindingSchema),
  evidenceIds: z.array(z.string()),
})

export type SubmissionEvidence = {
  id: string
  type:
    | "reflection"
    | "document"
    | "link"
    | "customer_conversation"
    | "published_offer"
    | "sales_ask"
    | "commitment"
    | "payment"
  title: string
  summary: string
  occurredAt: string
  status: "draft" | "submitted" | "verified" | "questioned"
  tags: string[]
}

export type GateContext = {
  gateRunId: string
  founderId: string
  day: ProgramDay
  submission: {
    id: string
    reflection: string
    claims: string[]
    evidence: SubmissionEvidence[]
  }
  priorClaims: string[]
  outcomeStates: {
    problem: "untested" | "explored" | "evidenced" | "focused"
    offer: "absent" | "drafted" | "exposed" | "understood" | "compelling"
    sales: "no_asks" | "asks_made" | "responses_captured" | "commitment" | "revenue"
  }
}

export type AgentFindingResult = z.infer<typeof agentFindingSchema>
export type OrchestratedGateResult = z.infer<typeof orchestratedGateResultSchema>
