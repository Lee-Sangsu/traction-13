import { describe, expect, it } from "vitest"
import {
  acceptedRunResponseSchema,
  gateRunRequestSchema,
  mentorMessageRequestSchema,
} from "./runs.js"

const gateRunRequest = {
  organizationId: "organization-1",
  cohortId: "cohort-1",
  founderId: "founder-1",
  idempotencyKey: "gate-submission-1",
  program: {
    templateId: "traction-13",
    templateVersion: "1.0.0",
    dayNumber: 4,
    gateId: "problem-gate",
  },
  submission: {
    id: "submission-1",
    submittedAt: "2026-07-17T15:00:00.000Z",
    reflection: "Hablamos con clientes que viven este problema.",
    claims: [
      {
        id: "claim-1",
        text: "El problema ocurre cada semana.",
        outcome: "problem",
        evidenceIds: ["evidence-1"],
      },
    ],
    evidence: [
      {
        id: "evidence-1",
        type: "customer_conversation",
        title: "Conversación con cliente",
        summary: "El cliente describió el problema y su frecuencia.",
        occurredAt: "2026-07-16T15:00:00.000Z",
        status: "verified",
      },
    ],
  },
  outcomeStates: {
    problem: "validating",
    offer: "not_started",
    sales: "not_started",
  },
  activeAgents: [
    {
      role: "evidence",
      version: "1.0.0",
    },
    {
      role: "problem",
      version: "1.0.0",
    },
  ],
}

describe("run contracts", () => {
  it("accepts an immutable gate evaluation snapshot", () => {
    const parsed = gateRunRequestSchema.parse(gateRunRequest)

    expect(parsed.submission.evidence).toHaveLength(1)
    expect(parsed.program.dayNumber).toBe(4)
  })

  it("rejects a gate request without evidence", () => {
    expect(() =>
      gateRunRequestSchema.parse({
        ...gateRunRequest,
        submission: {
          ...gateRunRequest.submission,
          evidence: [],
        },
      }),
    ).toThrow()
  })

  it("defaults mentor conversations to Spanish", () => {
    const parsed = mentorMessageRequestSchema.parse({
      organizationId: "organization-1",
      cohortId: "cohort-1",
      founderId: "founder-1",
      conversationId: "conversation-1",
      idempotencyKey: "mentor-message-1",
      message: "¿Qué debo validar hoy?",
    })

    expect(parsed.locale).toBe("es")
  })

  it("defines an asynchronous accepted-run response", () => {
    const parsed = acceptedRunResponseSchema.parse({
      runId: "run-1",
      state: "queued",
      eventsUrl: "/v1/runs/run-1/events",
      createdAt: "2026-07-17T15:00:00.000Z",
    })

    expect(parsed.state).toBe("queued")
  })
})
