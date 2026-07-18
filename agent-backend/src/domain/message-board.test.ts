import { describe, expect, it } from "vitest"
import { createMessageBoard } from "./message-board.js"
import type {
  AgentIdentity,
  DeliberationMessage,
  MessageType,
} from "./types.js"

const problemAgent: AgentIdentity = {
  role: "problem",
  version: "1.0.0",
  provider: "deterministic",
  model: "test-model",
}

const evidenceAgent: AgentIdentity = {
  role: "evidence",
  version: "1.0.0",
  provider: "deterministic",
  model: "test-model",
}

function message(
  id: string,
  type: MessageType,
  sender: AgentIdentity,
  targetMessageId?: string,
): DeliberationMessage {
  const round =
    type === "finding"
      ? "independent_evaluation"
      : type === "challenge" || type === "agreement"
        ? "challenge_round"
        : type === "judge_question" || type === "judge_result"
          ? "judging"
          : "revision_round"

  return {
    id,
    runId: "run-1",
    round,
    sender,
    recipients: [],
    type,
    targetMessageId,
    argument: {
      summary: `${type} summary`,
      rationale: `${type} rationale`,
      requestedResponse: type === "challenge",
    },
    evidenceCitations: [{ evidenceId: "evidence-1" }],
    confidence: 0.8,
    promptVersion: "1.0.0",
    execution: {
      provider: "deterministic",
      model: "test-model",
      durationMs: 10,
      inputTokens: 20,
      outputTokens: 10,
      retryCount: 0,
    },
    createdAt: "2026-07-17T15:00:00.000Z",
  }
}

describe("shared deliberation board", () => {
  it("requires every challenge to target a persisted finding", () => {
    const board = createMessageBoard({
      runId: "run-1",
      agents: [problemAgent, evidenceAgent],
    }).advanceTo("challenge_round")

    expect(() =>
      board.publish(
        message("challenge-1", "challenge", problemAgent, "missing-finding"),
      ),
    ).toThrow("Challenge target does not exist")
  })

  it("publishes immutable messages without mutating an earlier snapshot", () => {
    const board = createMessageBoard({
      runId: "run-1",
      agents: [problemAgent, evidenceAgent],
    })
    const next = board.publish(
      message("finding-1", "finding", problemAgent),
    )

    expect(board.messages).toHaveLength(0)
    expect(next.messages).toHaveLength(1)
    expect(Object.isFrozen(next.messages[0])).toBe(true)
  })

  it("enforces a fixed per-agent message budget", () => {
    let board = createMessageBoard({
      runId: "run-1",
      agents: [problemAgent, evidenceAgent],
      budgets: { challenge: 1 },
    })
    board = board
      .publish(message("finding-1", "finding", problemAgent))
      .publish(message("finding-2", "finding", evidenceAgent))
      .advanceTo("challenge_round")
      .publish(
        message("challenge-1", "challenge", problemAgent, "finding-2"),
      )

    expect(() =>
      board.publish(
        message("challenge-2", "challenge", problemAgent, "finding-2"),
      ),
    ).toThrow("Agent message budget exceeded")
  })

  it("requires challenges to be answered before judging", () => {
    let board = createMessageBoard({
      runId: "run-1",
      agents: [problemAgent, evidenceAgent],
    })
    board = board
      .publish(message("finding-1", "finding", problemAgent))
      .publish(message("finding-2", "finding", evidenceAgent))
      .advanceTo("challenge_round")
      .publish(
        message("challenge-1", "challenge", problemAgent, "finding-2"),
      )
      .advanceTo("revision_round")

    expect(() => board.advanceTo("judging")).toThrow(
      "Every challenge requires a response",
    )
  })

  it("only accepts a challenge response from the targeted finding's agent", () => {
    let board = createMessageBoard({
      runId: "run-1",
      agents: [problemAgent, evidenceAgent],
    })
    board = board
      .publish(message("finding-1", "finding", problemAgent))
      .publish(message("finding-2", "finding", evidenceAgent))
      .advanceTo("challenge_round")
      .publish(
        message("challenge-1", "challenge", problemAgent, "finding-2"),
      )
      .advanceTo("revision_round")

    expect(() =>
      board.publish(
        message("response-1", "response", problemAgent, "challenge-1"),
      ),
    ).toThrow("Challenge response must come from the targeted agent")
  })

  it("cannot reopen the single challenge or revision round", () => {
    const board = createMessageBoard({
      runId: "run-1",
      agents: [problemAgent, evidenceAgent],
    })
      .advanceTo("challenge_round")
      .advanceTo("revision_round")

    expect(() => board.advanceTo("challenge_round")).toThrow(
      "Invalid deliberation round transition",
    )
  })
})
