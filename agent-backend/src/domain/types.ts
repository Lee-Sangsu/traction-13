import { z } from "zod"
import {
  agentRoleSchema,
  gateDecisionSchema,
  isoDateTimeSchema,
  resourceIdSchema,
  semanticVersionSchema,
  type AgentRole,
  type GateDecision,
  type RunState,
} from "../contracts/common.js"

export const providerNameSchema = z.enum([
  "deterministic",
  "codex",
  "claude",
])

export const agentIdentitySchema = z.object({
  role: agentRoleSchema,
  version: semanticVersionSchema,
  provider: providerNameSchema,
  model: z.string().trim().min(1).max(200),
})

export const deliberationRoundSchema = z.enum([
  "independent_evaluation",
  "challenge_round",
  "revision_round",
  "judging",
])

export const messageTypeSchema = z.enum([
  "finding",
  "challenge",
  "response",
  "revision",
  "agreement",
  "judge_question",
  "judge_result",
])

export const evidenceCitationSchema = z.object({
  evidenceId: resourceIdSchema,
  claimId: resourceIdSchema.optional(),
  note: z.string().trim().min(1).max(500).optional(),
})

export const providerExecutionMetadataSchema = z.object({
  provider: providerNameSchema,
  model: z.string().trim().min(1).max(200),
  sessionId: resourceIdSchema.optional(),
  durationMs: z.number().int().nonnegative(),
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  retryCount: z.number().int().nonnegative(),
})

const expectedRoundByMessageType = {
  finding: "independent_evaluation",
  challenge: "challenge_round",
  agreement: "challenge_round",
  response: "revision_round",
  revision: "revision_round",
  judge_question: "judging",
  judge_result: "judging",
} as const

export const deliberationMessageSchema = z
  .object({
    id: resourceIdSchema,
    runId: resourceIdSchema,
    round: deliberationRoundSchema,
    sender: agentIdentitySchema,
    recipients: z.array(agentRoleSchema).max(20),
    type: messageTypeSchema,
    targetMessageId: resourceIdSchema.optional(),
    argument: z.object({
      summary: z.string().trim().min(1).max(2_000),
      rationale: z.string().trim().min(1).max(6_000),
      requestedResponse: z.boolean(),
    }),
    evidenceCitations: z.array(evidenceCitationSchema).max(100),
    confidence: z.number().min(0).max(1),
    promptVersion: semanticVersionSchema,
    execution: providerExecutionMetadataSchema,
    createdAt: isoDateTimeSchema,
  })
  .superRefine((message, context) => {
    if (message.round !== expectedRoundByMessageType[message.type]) {
      context.addIssue({
        code: "custom",
        message: `${message.type} is not allowed in ${message.round}`,
        path: ["round"],
      })
    }
  })

export const unresolvedDisagreementSchema = z.object({
  summary: z.string().trim().min(1).max(2_000),
  material: z.boolean(),
  agentRoles: z.array(agentRoleSchema).min(2).max(20),
})

export const judgeResultSchema = z.object({
  recommendedDecision: gateDecisionSchema,
  confidence: z.number().min(0).max(1),
  evidenceCitations: z.array(evidenceCitationSchema).min(1).max(100),
  unresolvedDisagreements: z.array(unresolvedDisagreementSchema).max(50),
  groupthinkRisk: z.enum(["low", "medium", "high"]),
  unsupportedConclusions: z.array(z.string().trim().min(1).max(1_000)).max(50),
  requiredAdminReview: z.boolean(),
  mentorEmphasis: z.string().trim().min(1).max(2_000),
})

export const runStageSchema = z.object({
  state: z.custom<RunState>(),
  attempt: z.number().int().positive(),
  startedAt: isoDateTimeSchema,
  completedAt: isoDateTimeSchema.nullable(),
})

export type AgentIdentity = z.infer<typeof agentIdentitySchema>
export type DeliberationMessage = z.infer<typeof deliberationMessageSchema>
export type DeliberationRound = z.infer<typeof deliberationRoundSchema>
export type EvidenceCitation = z.infer<typeof evidenceCitationSchema>
export type JudgeResult = z.infer<typeof judgeResultSchema>
export type MessageType = z.infer<typeof messageTypeSchema>
export type ProviderName = z.infer<typeof providerNameSchema>

export type { AgentRole, GateDecision, RunState }
