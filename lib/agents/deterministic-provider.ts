import { agentFindingSchema } from "@/lib/agents/schemas"
import type {
  AgentEvaluationInput,
  AgentProvider,
} from "@/lib/agents/provider"
import type { AgentRole } from "@/lib/traction/types"

const MINIMUM_FALLBACK = 1

function evidenceIds({ context }: AgentEvaluationInput) {
  return context.submission.evidence.map((evidence) => evidence.id)
}

function includesContradiction({ context }: AgentEvaluationInput) {
  const currentClaims = context.submission.claims.join(" ").toLocaleLowerCase("es")
  const evidenceText = context.submission.evidence
    .flatMap((evidence) => [evidence.title, evidence.summary, ...evidence.tags])
    .join(" ")
    .toLocaleLowerCase("es")
  const priorClaims = context.priorClaims.join(" ").toLocaleLowerCase("es")

  return (
    evidenceText.includes("contradicción") ||
    (currentClaims.includes("ninguna alternativa") &&
      (evidenceText.includes("airbnb") || priorClaims.includes("airbnb")))
  )
}

function buildEvaluation(
  agent: AgentRole,
  input: AgentEvaluationInput,
) {
  const ids = evidenceIds(input)
  const requirementMinimum = Math.max(
    MINIMUM_FALLBACK,
    ...input.context.day.evidenceRequirements.map(
      (requirement) => requirement.minimumCount ?? MINIMUM_FALLBACK,
    ),
  )
  const enoughEvidence = ids.length >= requirementMinimum
  const contradiction = includesContradiction(input)

  if (agent === "consistency" && contradiction) {
    return {
      agent,
      verdict: "weak" as const,
      confidence: 0.94,
      summary:
        "La conclusión contradice la evidencia registrada y necesita revisión humana.",
      evidenceIds: ids,
      concerns: [
        "La afirmación sobre alternativas no coincide con lo dicho por el cliente.",
      ],
      recommendedActions: [
        "Cita textualmente la evidencia y reformula la conclusión sin borrar la contradicción.",
      ],
    }
  }

  if (agent === "evidence") {
    return {
      agent,
      verdict: enoughEvidence ? ("strong" as const) : ("weak" as const),
      confidence: enoughEvidence ? 0.9 : 0.91,
      summary: enoughEvidence
        ? "La entrega contiene evidencia atribuible para evaluar esta misión."
        : "La entrega todavía no cumple la cantidad mínima de evidencia externa.",
      evidenceIds: ids,
      concerns: enoughEvidence ? [] : ["Faltan fuentes externas suficientes."],
      recommendedActions: enoughEvidence
        ? ["Continúa con la evaluación metodológica."]
        : ["Añade evidencia real antes de avanzar."],
    }
  }

  if (agent === "mentor") {
    const weakFinding = input.priorFindings.find(
      (finding) => finding.verdict === "weak",
    )

    return {
      agent,
      verdict: weakFinding ? ("mixed" as const) : ("strong" as const),
      confidence: weakFinding ? 0.83 : 0.88,
      summary: weakFinding
        ? `La evidencia abre una pregunta importante: ${weakFinding.concerns[0] ?? weakFinding.summary}`
        : "Tu evidencia permite avanzar. Ahora convierte el plan en una entrevista real y registra lo que contradiga tu hipótesis.",
      evidenceIds: ids,
      concerns: weakFinding?.concerns ?? [],
      recommendedActions: weakFinding?.recommendedActions ?? [
        "Contacta hoy a la primera persona de tu lista y registra citas textuales.",
      ],
    }
  }

  if (agent === "journey") {
    const weakFinding = input.priorFindings.find(
      (finding) => finding.verdict === "weak",
    )

    return {
      agent,
      verdict: weakFinding ? ("mixed" as const) : ("strong" as const),
      confidence: 0.86,
      summary: weakFinding
        ? "El recorrido debe detener la dependencia y abrir una misión de recuperación."
        : "El recorrido puede avanzar a la siguiente acción de campo.",
      evidenceIds: ids,
      concerns: weakFinding?.concerns ?? [],
      recommendedActions: weakFinding
        ? [
            "Contrasta la conclusión con la fuente original y entrega una síntesis corregida.",
          ]
        : [
            "Realiza la primera entrevista en las próximas 24 horas y sube notas atribuibles.",
          ],
    }
  }

  const verdict = enoughEvidence ? ("strong" as const) : ("mixed" as const)

  return {
    agent,
    verdict,
    confidence: enoughEvidence ? 0.84 : 0.72,
    summary: enoughEvidence
      ? "La entrega es específica y puede contrastarse con el siguiente paso de campo."
      : "La dirección es útil, pero necesita más evidencia externa para sostenerse.",
    evidenceIds: ids,
    concerns: enoughEvidence ? [] : ["La conclusión depende demasiado de reflexión interna."],
    recommendedActions: enoughEvidence
      ? ["Avanza sin convertir la hipótesis en una certeza."]
      : ["Recoge una fuente externa adicional y vuelve a evaluar."],
  }
}

export class DeterministicAgentProvider implements AgentProvider {
  async evaluate(agent: AgentRole, input: AgentEvaluationInput) {
    return agentFindingSchema.parse(buildEvaluation(agent, input))
  }
}
