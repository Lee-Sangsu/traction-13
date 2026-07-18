import { describe, expect, it } from "vitest"
import { applyDecisionPolicy } from "./policy.js"
import type {
  AgentIdentity,
  DeliberationMessage,
  JudgeResult,
} from "./types.js"

const evidenceAgent: AgentIdentity = {
  role: "evidence",
  version: "1.0.0",
  provider: "deterministic",
  model: "test-model",
}

const problemAgent: AgentIdentity = {
  role: "problem",
  version: "1.0.0",
  provider: "deterministic",
  model: "test-model",
}

function finding(
  id: string,
  sender: AgentIdentity,
): DeliberationMessage {
  return {
    id,
    runId: "run-1",
    round: "independent_evaluation",
    sender,
    recipients: [],
    type: "finding",
    argument: {
      summary: "Finding",
      rationale: "Supported by customer evidence.",
      requestedResponse: false,
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

function judge(overrides: Partial<JudgeResult> = {}): JudgeResult {
  return {
    recommendedDecision: "advance",
    confidence: 0.9,
    evidenceCitations: [{ evidenceId: "evidence-1" }],
    unresolvedDisagreements: [],
    groupthinkRisk: "low",
    unsupportedConclusions: [],
    requiredAdminReview: false,
    mentorEmphasis: "Pide una venta real.",
    ...overrides,
  }
}

const findings = [
  finding("finding-1", evidenceAgent),
  finding("finding-2", problemAgent),
]

describe("deterministic decision policy", () => {
  it("cannot advance without a valid judge result", () => {
    expect(
      applyDecisionPolicy({
        judge: null,
        findings,
        requiredAgents: ["evidence", "problem"],
        availableEvidenceIds: ["evidence-1"],
      }),
    ).toBe("admin_intervention")
  })

  it("requires every configured evaluator to publish a finding", () => {
    expect(
      applyDecisionPolicy({
        judge: judge(),
        findings: [findings[0]],
        requiredAgents: ["evidence", "problem"],
        availableEvidenceIds: ["evidence-1"],
      }),
    ).toBe("admin_intervention")
  })

  it("blocks advancement when a citation is not in the run snapshot", () => {
    expect(
      applyDecisionPolicy({
        judge: judge({
          evidenceCitations: [{ evidenceId: "invented-evidence" }],
        }),
        findings,
        requiredAgents: ["evidence", "problem"],
        availableEvidenceIds: ["evidence-1"],
      }),
    ).toBe("admin_intervention")
  })

  it("requests more validation when judge confidence is low", () => {
    expect(
      applyDecisionPolicy({
        judge: judge({ confidence: 0.6 }),
        findings,
        requiredAgents: ["evidence", "problem"],
        availableEvidenceIds: ["evidence-1"],
      }),
    ).toBe("validate_more")
  })

  it("requires revision while material disagreement remains", () => {
    expect(
      applyDecisionPolicy({
        judge: judge({
          unresolvedDisagreements: [
            {
              summary: "The evidence does not establish frequency.",
              material: true,
              agentRoles: ["evidence", "problem"],
            },
          ],
        }),
        findings,
        requiredAgents: ["evidence", "problem"],
        availableEvidenceIds: ["evidence-1"],
      }),
    ).toBe("revise")
  })

  it("accepts the judge recommendation after deterministic safeguards", () => {
    expect(
      applyDecisionPolicy({
        judge: judge({ recommendedDecision: "accelerate" }),
        findings,
        requiredAgents: ["evidence", "problem"],
        availableEvidenceIds: ["evidence-1"],
      }),
    ).toBe("accelerate")
  })
})
