import { describe, expect, it } from "vitest"

import {
  canOpenDay,
  getOutcomeProgress,
  sortInterventions,
} from "@/lib/traction/progression"
import type { Intervention } from "@/lib/traction/types"

describe("journey progression", () => {
  it("keeps a dependent mission locked until its gate advances", () => {
    expect(canOpenDay({ requestedDay: 7, unlockedThrough: 6 })).toBe(false)
    expect(canOpenDay({ requestedDay: 6, unlockedThrough: 6 })).toBe(true)
  })

  it("maps operational outcome states to stable progress values", () => {
    expect(getOutcomeProgress("problem", "evidenced")).toBe(75)
    expect(getOutcomeProgress("offer", "exposed")).toBe(60)
    expect(getOutcomeProgress("sales", "revenue")).toBe(100)
  })

  it("orders interventions by severity and then age", () => {
    const interventions: Intervention[] = [
      {
        id: "recent-medium",
        founderId: "founder-1",
        title: "Revisión media",
        severity: "medium",
        createdAt: "2026-07-17T10:00:00.000Z",
        status: "open",
        reason: "low_confidence",
      },
      {
        id: "old-critical",
        founderId: "founder-2",
        title: "Conflicto crítico",
        severity: "critical",
        createdAt: "2026-07-16T10:00:00.000Z",
        status: "open",
        reason: "evidence_conflict",
      },
      {
        id: "recent-critical",
        founderId: "founder-3",
        title: "Riesgo crítico reciente",
        severity: "critical",
        createdAt: "2026-07-17T11:00:00.000Z",
        status: "open",
        reason: "suspected_manipulation",
      },
    ]

    expect(sortInterventions(interventions).map(({ id }) => id)).toEqual([
      "old-critical",
      "recent-critical",
      "recent-medium",
    ])
  })
})
