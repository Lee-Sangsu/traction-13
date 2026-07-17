import { describe, expect, it } from "vitest"

import { traction13 } from "@/lib/traction/curriculum"

describe("Traction 13 canonical curriculum", () => {
  it("defines exactly thirteen ordered days", () => {
    expect(traction13.days).toHaveLength(13)
    expect(traction13.days.map((day) => day.number)).toEqual(
      Array.from({ length: 13 }, (_, index) => index + 1),
    )
  })

  it("configures evidence and relevant agents for every soft gate", () => {
    for (const day of traction13.days) {
      expect(day.evidenceRequirements.length).toBeGreaterThan(0)
      expect(day.activeAgents).toContain("evidence")
      expect(day.activeAgents).toContain("mentor")
      expect(day.activeAgents).toContain("journey")
    }
  })

  it("keeps the approved sales sequence on days nine through eleven", () => {
    expect(traction13.days.slice(8, 11).map((day) => day.title)).toEqual([
      "Haz pedidos reales",
      "Aprende de las objeciones",
      "Vende otra vez",
    ])
  })
})
