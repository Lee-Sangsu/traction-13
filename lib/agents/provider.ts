import type {
  AgentFindingResult,
  GateContext,
} from "@/lib/agents/schemas"
import type { AgentRole } from "@/lib/traction/types"

export type AgentEvaluationInput = {
  context: GateContext
  priorFindings: AgentFindingResult[]
}

export interface AgentProvider {
  evaluate(
    agent: AgentRole,
    input: AgentEvaluationInput,
  ): Promise<AgentFindingResult>
}
