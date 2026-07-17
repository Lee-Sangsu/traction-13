import type {
  Intervention,
  OfferState,
  OutcomeDimension,
  ProblemState,
  SalesState,
} from "@/lib/traction/types"

const OUTCOME_PROGRESS: {
  problem: Record<ProblemState, number>
  offer: Record<OfferState, number>
  sales: Record<SalesState, number>
} = {
  problem: {
    untested: 0,
    explored: 35,
    evidenced: 75,
    focused: 100,
  },
  offer: {
    absent: 0,
    drafted: 30,
    exposed: 60,
    understood: 80,
    compelling: 100,
  },
  sales: {
    no_asks: 0,
    asks_made: 30,
    responses_captured: 55,
    commitment: 80,
    revenue: 100,
  },
}

const SEVERITY_SCORE: Record<Intervention["severity"], number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
}

export function canOpenDay({
  requestedDay,
  unlockedThrough,
}: {
  requestedDay: number
  unlockedThrough: number
}) {
  return requestedDay >= 1 && requestedDay <= unlockedThrough
}

export function getOutcomeProgress<TDimension extends OutcomeDimension>(
  dimension: TDimension,
  state:
    | ProblemState
    | OfferState
    | SalesState,
) {
  return (OUTCOME_PROGRESS[dimension] as Record<string, number>)[state] ?? 0
}

export function sortInterventions(interventions: Intervention[]) {
  return [...interventions].sort((left, right) => {
    const severityDifference =
      SEVERITY_SCORE[right.severity] - SEVERITY_SCORE[left.severity]

    if (severityDifference !== 0) {
      return severityDifference
    }

    return Date.parse(left.createdAt) - Date.parse(right.createdAt)
  })
}
