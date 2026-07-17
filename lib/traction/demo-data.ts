import { traction13 } from "@/lib/traction/curriculum"
import type {
  AgentRun,
  Cohort,
  EvidenceItem,
  Founder,
  FounderJourney,
  Intervention,
  OfferVersion,
  SalesEvent,
} from "@/lib/traction/types"

export const demoFounder: Founder = {
  id: "founder-sofia",
  name: "Sofía Martínez",
  email: "sofia@traction13.demo",
  avatarInitials: "SM",
  city: "Bogotá",
  ventureName: "Ruta Local",
  ventureSummary:
    "Experiencias de barrio diseñadas con anfitriones independientes de Bogotá.",
  mode: "solo",
  joinedAt: "2026-07-12T14:00:00.000Z",
}

export const demoCohort: Cohort = {
  id: "cohort-bogota-2026-07",
  name: "Bogotá · Julio 2026",
  templateId: traction13.id,
  templateVersion: traction13.version,
  timezone: "America/Bogota",
  startsAt: "2026-07-13T13:00:00.000Z",
  endsAt: "2026-07-25T23:59:00.000Z",
  participantCount: 38,
  activeDay: 5,
}

export const demoJourney: FounderJourney = {
  id: "journey-sofia-july",
  founderId: demoFounder.id,
  cohortId: demoCohort.id,
  currentDay: 5,
  unlockedThrough: 5,
  streak: 4,
  outcomeStates: {
    problem: "explored",
    offer: "absent",
    sales: "no_asks",
  },
  days: traction13.days.map((day) => ({
    dayNumber: day.number,
    status:
      day.number < 5 ? "completed" : day.number === 5 ? "active" : "locked",
    attempts: day.number < 5 ? 1 : 0,
    decision: day.number < 5 ? "advance" : undefined,
    completedAt:
      day.number < 5
        ? `2026-07-${String(12 + day.number).padStart(2, "0")}T22:10:00.000Z`
        : undefined,
  })),
}

export const demoEvidence: EvidenceItem[] = [
  {
    id: "evidence-interview-luisa",
    founderId: demoFounder.id,
    dayNumber: 5,
    type: "customer_conversation",
    title: "Conversación con Luisa · Chapinero",
    summary:
      "Quiere experiencias pequeñas, pero no confía en planes sin reseñas ni punto de encuentro claro.",
    sourceName: "Luisa P.",
    occurredAt: "2026-07-17T14:30:00.000Z",
    status: "verified",
    tags: ["confianza", "reseñas", "logística"],
  },
  {
    id: "evidence-interview-mateo",
    founderId: demoFounder.id,
    dayNumber: 5,
    type: "customer_conversation",
    title: "Conversación con Mateo · Teusaquillo",
    summary:
      "Busca actividades para visitantes que no se sientan como tours masivos.",
    sourceName: "Mateo R.",
    occurredAt: "2026-07-17T16:00:00.000Z",
    status: "submitted",
    tags: ["autenticidad", "grupos pequeños"],
  },
]

export const demoOffers: OfferVersion[] = [
  {
    id: "offer-ruta-local-v1",
    founderId: demoFounder.id,
    version: 1,
    customer: "Visitantes de Bogotá que rechazan los tours masivos",
    promise: "Conoce un barrio con quien lo vive, en un grupo de máximo seis personas.",
    format: "Experiencia presencial de dos horas",
    priceCop: 85000,
    callToAction: "Reserva tu primera ruta",
    status: "draft",
    createdAt: "2026-07-17T18:00:00.000Z",
  },
]

export const demoSalesEvents: SalesEvent[] = [
  {
    id: "sales-ask-1",
    founderId: demoFounder.id,
    contactName: "Camilo",
    company: "Selina Chapinero",
    kind: "ask",
    summary: "Pidió presentar la experiencia a tres huéspedes esta semana.",
    occurredAt: "2026-07-17T19:00:00.000Z",
  },
  {
    id: "sales-objection-1",
    founderId: demoFounder.id,
    contactName: "Camilo",
    company: "Selina Chapinero",
    kind: "objection",
    summary: "Necesita una política clara de lluvia y cancelación.",
    occurredAt: "2026-07-17T19:12:00.000Z",
  },
]

export const demoAgentRuns: AgentRun[] = [
  {
    id: "agent-run-day-4",
    founderId: demoFounder.id,
    dayNumber: 4,
    status: "completed",
    decision: "advance",
    confidence: 0.87,
    disagreement: 0.08,
    startedAt: "2026-07-16T22:05:00.000Z",
    completedAt: "2026-07-16T22:05:18.000Z",
    latencyMs: 18042,
    costUsd: 0.19,
    findings: [],
  },
]

export const demoInterventions: Intervention[] = [
  {
    id: "intervention-andres-conflict",
    founderId: "founder-andres",
    title: "Conflicto entre entrevista y síntesis",
    severity: "critical",
    createdAt: "2026-07-17T13:15:00.000Z",
    status: "open",
    reason: "evidence_conflict",
  },
  {
    id: "intervention-valentina-revision",
    founderId: "founder-valentina",
    title: "Tres revisiones sin nueva evidencia",
    severity: "high",
    createdAt: "2026-07-17T15:40:00.000Z",
    status: "open",
    reason: "repeated_revision",
  },
  {
    id: "intervention-nicolas-inactive",
    founderId: "founder-nicolas",
    title: "Sin actividad durante 36 horas",
    severity: "medium",
    createdAt: "2026-07-16T11:00:00.000Z",
    status: "in_review",
    reason: "inactivity",
  },
]
