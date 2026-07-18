import { z } from "zod"
import {
  agentRoleSchema,
  evidenceReferenceSchema,
  gateDecisionSchema,
  isoDateTimeSchema,
  outcomeSchema,
  outcomeStateSchema,
  resourceIdSchema,
  runStateSchema,
  semanticVersionSchema,
} from "./common.js"

const requestIdentitySchema = z.object({
  organizationId: resourceIdSchema,
  cohortId: resourceIdSchema,
  founderId: resourceIdSchema,
  idempotencyKey: z.string().trim().min(8).max(200),
})

export const activeAgentSchema = z.object({
  role: agentRoleSchema,
  version: semanticVersionSchema,
})

export const programContextSchema = z.object({
  templateId: resourceIdSchema,
  templateVersion: semanticVersionSchema,
  dayNumber: z.number().int().min(1).max(365),
  gateId: resourceIdSchema,
})

export const founderClaimSchema = z.object({
  id: resourceIdSchema,
  text: z.string().trim().min(1).max(2_000),
  outcome: outcomeSchema,
  evidenceIds: z.array(resourceIdSchema).min(1).max(50),
})

export const mentorMessageRequestSchema = requestIdentitySchema.extend({
  conversationId: resourceIdSchema,
  message: z.string().trim().min(1).max(8_000),
  locale: z.literal("es").default("es"),
  program: programContextSchema.optional(),
})

export const gateRunRequestSchema = requestIdentitySchema.extend({
  conversationId: resourceIdSchema.optional(),
  program: programContextSchema,
  submission: z.object({
    id: resourceIdSchema,
    submittedAt: isoDateTimeSchema,
    reflection: z.string().trim().min(1).max(8_000),
    claims: z.array(founderClaimSchema).min(1).max(100),
    evidence: z.array(evidenceReferenceSchema).min(1).max(200),
  }),
  outcomeStates: z.object({
    problem: outcomeStateSchema,
    offer: outcomeStateSchema,
    sales: outcomeStateSchema,
  }),
  activeAgents: z.array(activeAgentSchema).min(1).max(20),
})

export const acceptedRunResponseSchema = z.object({
  runId: resourceIdSchema,
  state: z.literal("queued"),
  eventsUrl: z.string().startsWith("/v1/runs/"),
  createdAt: isoDateTimeSchema,
})

export const runSnapshotSchema = z.object({
  id: resourceIdSchema,
  organizationId: resourceIdSchema,
  cohortId: resourceIdSchema,
  founderId: resourceIdSchema,
  kind: z.enum(["mentor_message", "gate_evaluation"]),
  state: runStateSchema,
  currentStageAttempt: z.number().int().nonnegative(),
  decision: gateDecisionSchema.nullable(),
  mentorMessage: z.string().trim().min(1).nullable(),
  queue: z.object({
    lane: z.enum(["mentor", "gate", "admin", "shadow_judge", "eval"]),
    position: z.number().int().positive().nullable(),
  }),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
  completedAt: isoDateTimeSchema.nullable(),
})

export const cancellationRequestSchema = z.object({
  reason: z.string().trim().min(1).max(500),
})

export const cancellationResponseSchema = z.object({
  runId: resourceIdSchema,
  state: z.literal("cancelled"),
  cancelledAt: isoDateTimeSchema,
})

export const adminRunActionRequestSchema = z.object({
  reason: z.string().trim().min(1).max(1_000),
  expectedVersion: z.number().int().nonnegative(),
})

export const adminRejudgeRequestSchema = adminRunActionRequestSchema.extend({
  judgeVersion: semanticVersionSchema,
  shadowOnly: z.boolean().default(false),
})

export type GateRunRequest = z.infer<typeof gateRunRequestSchema>
export type MentorMessageRequest = z.infer<typeof mentorMessageRequestSchema>
export type RunSnapshot = z.infer<typeof runSnapshotSchema>
