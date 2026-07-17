import type { GateContext } from "@/lib/agents/schemas"

export function createContextSnapshot(context: GateContext): GateContext {
  return structuredClone(context)
}
