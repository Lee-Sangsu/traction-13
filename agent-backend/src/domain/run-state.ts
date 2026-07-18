import type { RunState } from "../contracts/common.js"

const terminalStates: ReadonlySet<RunState> = new Set([
  "completed",
  "admin_review",
  "failed",
  "cancelled",
])

const forwardTransitions: Readonly<Partial<Record<RunState, RunState>>> = {
  queued: "snapshotting",
  snapshotting: "independent_evaluation",
  independent_evaluation: "challenge_round",
  challenge_round: "revision_round",
  revision_round: "judging",
  judging: "decision_policy",
  decision_policy: "mentoring",
  mentoring: "completed",
}

export function canTransition(from: RunState, to: RunState): boolean {
  if (terminalStates.has(from) || from === to) {
    return false
  }

  if (to === "cancelled" || to === "failed" || to === "admin_review") {
    return true
  }

  return forwardTransitions[from] === to
}

export function assertTransition(from: RunState, to: RunState): void {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid run transition: ${from} -> ${to}`)
  }
}

export function isTerminalState(state: RunState): boolean {
  return terminalStates.has(state)
}
