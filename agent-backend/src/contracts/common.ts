import { z } from "zod"

export const resourceIdSchema = z.string().trim().min(1).max(128)
export const semanticVersionSchema = z
  .string()
  .regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/)
export const isoDateTimeSchema = z.string().datetime({ offset: true })

export const serviceScopeSchema = z.enum([
  "runs:create",
  "runs:read",
  "runs:cancel",
  "admin:runs:read",
  "admin:runs:write",
  "evals:run",
  "evals:read",
  "versions:promote",
])

export const agentRoleSchema = z.enum([
  "orchestrator",
  "evidence",
  "problem",
  "offer",
  "sales",
  "consistency",
  "mentor",
  "journey",
  "judge",
])

export const runStateSchema = z.enum([
  "queued",
  "snapshotting",
  "independent_evaluation",
  "challenge_round",
  "revision_round",
  "judging",
  "decision_policy",
  "mentoring",
  "completed",
  "admin_review",
  "failed",
  "cancelled",
])

export const gateDecisionSchema = z.enum([
  "advance",
  "revise",
  "validate_more",
  "redirect",
  "accelerate",
  "admin_intervention",
])

export const outcomeSchema = z.enum(["problem", "offer", "sales"])

export const outcomeStateSchema = z.enum([
  "not_started",
  "exploring",
  "validating",
  "demonstrated",
  "achieved",
  "blocked",
])

export const evidenceTypeSchema = z.enum([
  "customer_conversation",
  "offer_publication",
  "sales_ask",
  "payment",
  "letter_of_intent",
  "analytics",
  "artifact",
  "pitch",
  "traction_report",
  "other",
])

export const evidenceStatusSchema = z.enum([
  "submitted",
  "verified",
  "disputed",
  "rejected",
])

export const evidenceReferenceSchema = z.object({
  id: resourceIdSchema,
  type: evidenceTypeSchema,
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().min(1).max(4_000),
  occurredAt: isoDateTimeSchema,
  status: evidenceStatusSchema,
  sourceUrl: z.string().url().optional(),
  tags: z.array(z.string().trim().min(1).max(64)).max(20).default([]),
})

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string().trim().min(1),
    message: z.string().trim().min(1),
    requestId: resourceIdSchema.optional(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
})

export type AgentRole = z.infer<typeof agentRoleSchema>
export type GateDecision = z.infer<typeof gateDecisionSchema>
export type RunState = z.infer<typeof runStateSchema>
export type ServiceScope = z.infer<typeof serviceScopeSchema>
