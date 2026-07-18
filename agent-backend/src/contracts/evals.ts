import { z } from "zod"
import {
  agentRoleSchema,
  isoDateTimeSchema,
  resourceIdSchema,
  semanticVersionSchema,
} from "./common.js"

export const evalSuiteExecutionRequestSchema = z.object({
  organizationId: resourceIdSchema,
  suiteId: resourceIdSchema,
  candidate: z.object({
    role: agentRoleSchema,
    version: semanticVersionSchema,
  }),
  baselineVersion: semanticVersionSchema.optional(),
  provider: z.enum(["deterministic", "codex", "claude"]),
  fixtureIds: z.array(resourceIdSchema).min(1).max(1_000).optional(),
  shadow: z.boolean().default(true),
})

export const evalSuiteAcceptedResponseSchema = z.object({
  evalRunId: resourceIdSchema,
  state: z.literal("queued"),
  createdAt: isoDateTimeSchema,
})

export const evalSuiteResultSchema = z.object({
  evalRunId: resourceIdSchema,
  suiteId: resourceIdSchema,
  state: z.enum(["running", "passed", "failed"]),
  fixtureCount: z.number().int().nonnegative(),
  metrics: z.object({
    policyAgreement: z.number().min(0).max(1),
    citationValidity: z.number().min(0).max(1),
    schemaValidity: z.number().min(0).max(1),
    adminReviewRate: z.number().min(0).max(1),
  }),
  promotionEligible: z.boolean(),
  completedAt: isoDateTimeSchema.nullable(),
})

export const promoteAgentVersionRequestSchema = z.object({
  organizationId: resourceIdSchema,
  role: agentRoleSchema,
  version: semanticVersionSchema,
  evalRunId: resourceIdSchema,
  reason: z.string().trim().min(1).max(1_000),
})

export type EvalSuiteResult = z.infer<typeof evalSuiteResultSchema>
