import type {
  AgentRole,
  DeliberationMessage,
  GateDecision,
  JudgeResult,
} from "./types.js"

const DEFAULT_CONFIDENCE_THRESHOLD = 0.72

export interface DecisionPolicyInput {
  judge: JudgeResult | null
  findings: readonly DeliberationMessage[]
  requiredAgents: readonly AgentRole[]
  availableEvidenceIds: readonly string[]
  confidenceThreshold?: number
}

export function applyDecisionPolicy(
  input: DecisionPolicyInput,
): GateDecision {
  if (input.judge === null) {
    return "admin_intervention"
  }

  const findingRoles = new Set(
    input.findings
      .filter((finding) => finding.type === "finding")
      .map((finding) => finding.sender.role),
  )
  if (input.requiredAgents.some((role) => !findingRoles.has(role))) {
    return "admin_intervention"
  }

  const availableEvidence = new Set(input.availableEvidenceIds)
  const citations = [
    ...input.findings.flatMap((finding) => finding.evidenceCitations),
    ...input.judge.evidenceCitations,
  ]
  if (
    citations.some((citation) => !availableEvidence.has(citation.evidenceId))
  ) {
    return "admin_intervention"
  }

  if (input.judge.requiredAdminReview) {
    return "admin_intervention"
  }

  const threshold =
    input.confidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD
  if (input.judge.confidence < threshold) {
    return "validate_more"
  }

  if (
    input.judge.unresolvedDisagreements.some(
      (disagreement) => disagreement.material,
    ) ||
    input.judge.unsupportedConclusions.length > 0 ||
    input.judge.groupthinkRisk === "high"
  ) {
    return "revise"
  }

  return input.judge.recommendedDecision
}
