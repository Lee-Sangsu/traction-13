import { createContextSnapshot } from "@/lib/agents/context"
import { DeterministicAgentProvider } from "@/lib/agents/deterministic-provider"
import type { AgentProvider } from "@/lib/agents/provider"
import { isEvaluatorAgent } from "@/lib/agents/registry"
import {
  orchestratedGateResultSchema,
  type AgentFindingResult,
  type GateContext,
} from "@/lib/agents/schemas"
import type { GateDecision } from "@/lib/traction/types"

const VERDICT_SCORE: Record<AgentFindingResult["verdict"], number> = {
  strong: 1,
  mixed: 0.6,
  weak: 0,
  not_applicable: 0.5,
}

function calculateDisagreement(findings: AgentFindingResult[]) {
  if (findings.length < 2) {
    return 0
  }

  const scores = findings.map((finding) => VERDICT_SCORE[finding.verdict])
  return Math.max(...scores) - Math.min(...scores)
}

function calculateConfidence(findings: AgentFindingResult[]) {
  if (findings.length === 0) {
    return 0
  }

  const total = findings.reduce(
    (sum, finding) => sum + finding.confidence,
    0,
  )
  return total / findings.length
}

function chooseDecision(
  findings: AgentFindingResult[],
  disagreement: number,
): GateDecision {
  if (disagreement >= 0.5) {
    return "admin_intervention"
  }

  if (findings.some((finding) => finding.verdict === "weak")) {
    return "validate_more"
  }

  if (findings.some((finding) => finding.verdict === "mixed")) {
    return "revise"
  }

  return "advance"
}

export async function orchestrateGate(
  rawContext: GateContext,
  provider: AgentProvider = new DeterministicAgentProvider(),
) {
  const context = createContextSnapshot(rawContext)
  const configuredAgents = context.day.activeAgents.filter(
    (agent) => agent !== "orchestrator",
  )
  const evaluatorAgents = configuredAgents.filter(isEvaluatorAgent)

  const evaluatorFindings = await Promise.all(
    evaluatorAgents.map((agent) =>
      provider.evaluate(agent, { context, priorFindings: [] }),
    ),
  )

  const mentorFinding = configuredAgents.includes("mentor")
    ? await provider.evaluate("mentor", {
        context,
        priorFindings: evaluatorFindings,
      })
    : undefined
  const journeyFinding = configuredAgents.includes("journey")
    ? await provider.evaluate("journey", {
        context,
        priorFindings: evaluatorFindings,
      })
    : undefined

  const steps = [
    ...evaluatorFindings,
    ...(mentorFinding ? [mentorFinding] : []),
    ...(journeyFinding ? [journeyFinding] : []),
  ]
  const disagreement = calculateDisagreement(evaluatorFindings)
  const decision = chooseDecision(evaluatorFindings, disagreement)
  const evidenceIds = Array.from(
    new Set(evaluatorFindings.flatMap((finding) => finding.evidenceIds)),
  )

  return orchestratedGateResultSchema.parse({
    gateRunId: context.gateRunId,
    decision,
    confidence: calculateConfidence(evaluatorFindings),
    disagreement,
    mentorMessage:
      mentorFinding?.summary ??
      "La evaluación terminó. Revisa el resultado antes de continuar.",
    nextAction:
      journeyFinding?.recommendedActions[0] ??
      "Revisa la evidencia y define la siguiente acción concreta.",
    findings: evaluatorFindings,
    steps,
    evidenceIds,
  })
}
