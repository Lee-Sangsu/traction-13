import { describe, expect, it } from "vitest"

import { orchestrateGate } from "@/lib/agents/orchestrator"
import { traction13 } from "@/lib/traction/curriculum"
import type { GateContext } from "@/lib/agents/schemas"

const dayFourInterviewPlanFixture: GateContext = {
  gateRunId: "gate-day-four",
  founderId: "founder-sofia",
  day: traction13.days[3],
  submission: {
    id: "submission-day-four",
    reflection:
      "Preparé preguntas abiertas y una lista de cinco personas que cumplen los criterios.",
    claims: ["Puedo contactar a cinco visitantes frecuentes de Bogotá."],
    evidence: [
      {
        id: "evidence-interview-plan",
        type: "document",
        title: "Guion y lista de entrevistas",
        summary:
          "Cinco contactos, criterios explícitos y preguntas sobre comportamientos pasados.",
        occurredAt: "2026-07-16T18:00:00.000Z",
        status: "submitted",
        tags: ["entrevistas", "guion"],
      },
    ],
  },
  priorClaims: [],
  outcomeStates: {
    problem: "explored",
    offer: "absent",
    sales: "no_asks",
  },
}

const conflictingEvidenceFixture: GateContext = {
  ...dayFourInterviewPlanFixture,
  gateRunId: "gate-conflict",
  day: traction13.days[4],
  submission: {
    id: "submission-conflict",
    reflection: "Las entrevistas confirman que nadie usa alternativas.",
    claims: ["Los clientes no usan ninguna alternativa."],
    evidence: [
      {
        id: "evidence-conflict",
        type: "customer_conversation",
        title: "Entrevista con cliente",
        summary:
          "La persona reserva experiencias en Airbnb y consulta recomendaciones del hotel.",
        occurredAt: "2026-07-17T14:00:00.000Z",
        status: "submitted",
        tags: ["contradicción", "alternativas"],
      },
    ],
  },
  priorClaims: ["Los clientes hoy reservan tours por Airbnb."],
}

describe("multi-agent gate orchestrator", () => {
  it("activates only agents configured for the gate", async () => {
    const result = await orchestrateGate(dayFourInterviewPlanFixture)

    expect(result.steps.map((step) => step.agent)).toEqual([
      "evidence",
      "problem",
      "consistency",
      "mentor",
      "journey",
    ])
  })

  it("escalates materially conflicting findings", async () => {
    const result = await orchestrateGate(conflictingEvidenceFixture)

    expect(result.decision).toBe("admin_intervention")
    expect(result.disagreement).toBeGreaterThanOrEqual(0.5)
    expect(result.findings.some((finding) => finding.verdict === "weak")).toBe(true)
  })

  it("returns Spanish mentoring and a concrete next action", async () => {
    const result = await orchestrateGate(dayFourInterviewPlanFixture)

    expect(result.mentorMessage).toMatch(/evidencia|entrevista/i)
    expect(result.nextAction.length).toBeGreaterThan(20)
    expect(result.confidence).toBeGreaterThan(0)
  })
})
