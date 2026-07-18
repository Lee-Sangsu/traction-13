import { z } from "zod"
import { isoDateTimeSchema, resourceIdSchema } from "./common.js"

export const runEventTypeSchema = z.enum([
  "run_queued",
  "state_changed",
  "agent_started",
  "agent_completed",
  "board_message_published",
  "judge_completed",
  "decision_recorded",
  "mentor_completed",
  "retry_scheduled",
  "run_completed",
  "run_failed",
  "run_cancelled",
])

export const runEventSchema = z.object({
  id: resourceIdSchema,
  runId: resourceIdSchema,
  sequence: z.number().int().nonnegative(),
  type: runEventTypeSchema,
  occurredAt: isoDateTimeSchema,
  data: z.record(z.string(), z.unknown()),
})

export const runEventPageSchema = z.object({
  events: z.array(runEventSchema),
  nextSequence: z.number().int().nonnegative(),
})

export type RunEvent = z.infer<typeof runEventSchema>
