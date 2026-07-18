import { describe, expect, it } from "vitest"
import { assertTransition, canTransition } from "./run-state.js"

describe("run state machine", () => {
  it("allows only declared run-state transitions", () => {
    expect(
      canTransition("independent_evaluation", "challenge_round"),
    ).toBe(true)
    expect(canTransition("independent_evaluation", "completed")).toBe(false)
  })

  it("allows cancellation from active work but not from a terminal state", () => {
    expect(canTransition("judging", "cancelled")).toBe(true)
    expect(canTransition("completed", "cancelled")).toBe(false)
  })

  it("reports an invalid transition with both states", () => {
    expect(() => assertTransition("queued", "completed")).toThrow(
      "Invalid run transition: queued -> completed",
    )
  })
})
