import type { AgentRole } from "@/lib/traction/types"

export const AGENT_LABELS: Record<AgentRole, string> = {
  evidence: "Verificador de evidencia",
  problem: "Evaluador de problema",
  offer: "Evaluador de oferta",
  sales: "Evaluador de ventas",
  consistency: "Crítico de consistencia",
  mentor: "Mentor de ejecución",
  journey: "Planificador del recorrido",
  orchestrator: "Orquestador",
}

export const EVALUATOR_AGENTS: AgentRole[] = [
  "evidence",
  "problem",
  "offer",
  "sales",
  "consistency",
]

export function isEvaluatorAgent(agent: AgentRole) {
  return EVALUATOR_AGENTS.includes(agent)
}
