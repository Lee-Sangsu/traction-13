import type {
  AgentRole,
  EvidenceRequirement,
  OutcomeDimension,
  ProgramDay,
  ProgramPhase,
  ProgramTemplate,
} from "@/lib/traction/types"

const CORE_AGENTS: AgentRole[] = ["evidence", "consistency", "mentor", "journey"]

type DayInput = {
  number: number
  phase: ProgramPhase
  title: string
  summary: string
  mission: string
  outcomeFocus: OutcomeDimension[]
  requirements: EvidenceRequirement[]
  evaluators?: AgentRole[]
  estimatedMinutes: number
}

function createDay({
  number,
  phase,
  title,
  summary,
  mission,
  outcomeFocus,
  requirements,
  evaluators = [],
  estimatedMinutes,
}: DayInput): ProgramDay {
  return {
    id: `traction-13-day-${number}`,
    number,
    phase,
    title,
    summary,
    mission,
    outcomeFocus,
    evidenceRequirements: requirements,
    activeAgents: Array.from(new Set(["evidence", ...evaluators, ...CORE_AGENTS])),
    estimatedMinutes,
    dependsOn: number === 1 ? [] : [number - 1],
    deadlineLabel: "Hoy, 11:59 p. m.",
  }
}

export const traction13: ProgramTemplate = {
  id: "traction-13",
  name: "Traction 13",
  version: 1,
  status: "active",
  language: "es",
  durationDays: 13,
  description:
    "Trece días para convertir una hipótesis en evidencia, una oferta expuesta y pedidos de venta reales.",
  days: [
    createDay({
      number: 1,
      phase: "foundation",
      title: "Define tu punto de partida",
      summary: "Haz visible desde dónde empiezas y qué estás dispuesto a cambiar.",
      mission:
        "Describe tu motivación, tus capacidades, tus restricciones y las ideas que hoy consideras posibles.",
      outcomeFocus: [],
      requirements: [
        {
          id: "founder-baseline",
          label: "Línea base personal",
          description: "Motivación, capacidades, restricciones e intereses.",
          type: "reflection",
        },
      ],
      estimatedMinutes: 45,
    }),
    createDay({
      number: 2,
      phase: "foundation",
      title: "Elige cómo avanzar",
      summary: "Decide si avanzas solo o exploras un equipo complementario.",
      mission:
        "Define tu forma de trabajo, disponibilidad, compromiso y condiciones para colaborar.",
      outcomeFocus: [],
      requirements: [
        {
          id: "commitment-contract",
          label: "Compromiso de ejecución",
          description: "Disponibilidad, reglas personales y decisión inicial de equipo.",
          type: "reflection",
        },
      ],
      estimatedMinutes: 40,
    }),
    createDay({
      number: 3,
      phase: "problem",
      title: "Encuentra un problema real",
      summary: "Formula un problema que pueda observarse y contrastarse.",
      mission:
        "Define una persona alcanzable, un contexto específico, una tensión y las alternativas que ya utiliza.",
      outcomeFocus: ["problem"],
      requirements: [
        {
          id: "problem-hypothesis",
          label: "Hipótesis de problema",
          description: "Cliente, contexto, tensión observada y alternativa actual.",
          type: "document",
        },
      ],
      evaluators: ["problem"],
      estimatedMinutes: 75,
    }),
    createDay({
      number: 4,
      phase: "problem",
      title: "Sal del edificio",
      summary: "Prepara conversaciones que puedan contradecirte.",
      mission:
        "Construye una lista de personas reales, un guion sin preguntas dirigidas y mensajes de invitación.",
      outcomeFocus: ["problem"],
      requirements: [
        {
          id: "interview-plan",
          label: "Plan de entrevistas",
          description: "Criterios, contactos, guion y mensajes de invitación.",
          type: "document",
        },
      ],
      evaluators: ["problem"],
      estimatedMinutes: 90,
    }),
    createDay({
      number: 5,
      phase: "problem",
      title: "Escucha evidencia",
      summary: "Habla con clientes reales y registra lo que ocurrió.",
      mission:
        "Completa al menos tres conversaciones, registra citas y separa observaciones de interpretaciones.",
      outcomeFocus: ["problem"],
      requirements: [
        {
          id: "customer-conversations",
          label: "Conversaciones reales",
          description: "Notas atribuibles, citas, contexto y reflexión por conversación.",
          type: "customer_conversation",
          minimumCount: 3,
        },
      ],
      evaluators: ["problem"],
      estimatedMinutes: 150,
    }),
    createDay({
      number: 6,
      phase: "problem",
      title: "Decide qué problema merece atención",
      summary: "Elige con evidencia, no por apego a la idea.",
      mission:
        "Sintetiza patrones, contradicciones, supuestos rechazados y una declaración de problema enfocada.",
      outcomeFocus: ["problem"],
      requirements: [
        {
          id: "problem-synthesis",
          label: "Síntesis del problema",
          description: "Patrones, contradicciones, descarte y problema elegido.",
          type: "document",
        },
      ],
      evaluators: ["problem"],
      estimatedMinutes: 90,
    }),
    createDay({
      number: 7,
      phase: "offer",
      title: "Construye una oferta comprable",
      summary: "Convierte lo aprendido en una promesa concreta y pagable.",
      mission:
        "Define cliente, promesa, alcance, formato, precio, credibilidad y llamado a la acción.",
      outcomeFocus: ["problem", "offer"],
      requirements: [
        {
          id: "offer-draft",
          label: "Oferta v1",
          description: "Promesa, formato, precio y llamado a la acción.",
          type: "document",
        },
      ],
      evaluators: ["problem", "offer"],
      estimatedMinutes: 120,
    }),
    createDay({
      number: 8,
      phase: "offer",
      title: "Pon la oferta en el mundo",
      summary: "Haz que una persona real pueda verla y aceptarla.",
      mission:
        "Publica la oferta en un formato accesible y conecta un llamado a la acción verificable.",
      outcomeFocus: ["offer"],
      requirements: [
        {
          id: "published-offer",
          label: "Oferta publicada",
          description: "URL, captura o mensaje enviado con un llamado a la acción activo.",
          type: "published_offer",
        },
      ],
      evaluators: ["offer"],
      estimatedMinutes: 150,
    }),
    createDay({
      number: 9,
      phase: "sales",
      title: "Haz pedidos reales",
      summary: "Pide una decisión; no te limites a compartir información.",
      mission:
        "Selecciona prospectos alcanzables, presenta tu oferta y registra pedidos de venta explícitos.",
      outcomeFocus: ["offer", "sales"],
      requirements: [
        {
          id: "real-sales-asks",
          label: "Pedidos de venta",
          description: "Prospecto, mensaje, fecha y respuesta de cada pedido.",
          type: "sales_ask",
          minimumCount: 5,
        },
      ],
      evaluators: ["offer", "sales"],
      estimatedMinutes: 150,
    }),
    createDay({
      number: 10,
      phase: "sales",
      title: "Aprende de las objeciones",
      summary: "Convierte cada respuesta en una decisión de mejora.",
      mission:
        "Clasifica objeciones, identifica fricción y revisa la oferta sin borrar el historial.",
      outcomeFocus: ["offer", "sales"],
      requirements: [
        {
          id: "objection-log",
          label: "Registro de objeciones",
          description: "Respuestas, pérdidas, señales de interés y oferta revisada.",
          type: "document",
        },
      ],
      evaluators: ["offer", "sales"],
      estimatedMinutes: 100,
    }),
    createDay({
      number: 11,
      phase: "sales",
      title: "Vende otra vez",
      summary: "Ejecuta un segundo ciclo con una hipótesis de mejora.",
      mission:
        "Haz seguimiento, prueba el precio o mensaje revisado y pide una decisión concreta.",
      outcomeFocus: ["offer", "sales"],
      requirements: [
        {
          id: "second-sales-cycle",
          label: "Segundo ciclo de ventas",
          description: "Seguimientos, pedidos, respuestas y compromisos o pagos.",
          type: "sales_ask",
          minimumCount: 3,
        },
      ],
      evaluators: ["offer", "sales"],
      estimatedMinutes: 150,
    }),
    createDay({
      number: 12,
      phase: "showcase",
      title: "Convierte acción en tracción",
      summary: "Construye una historia que pueda rastrearse hasta la evidencia.",
      mission:
        "Organiza métricas, decisiones, aprendizajes y fuentes en un reporte y un borrador de pitch.",
      outcomeFocus: ["problem", "offer", "sales"],
      requirements: [
        {
          id: "traction-report",
          label: "Reporte de tracción",
          description: "Resultados, métricas, aprendizajes y referencias a evidencia.",
          type: "document",
        },
      ],
      evaluators: ["problem", "offer", "sales"],
      estimatedMinutes: 120,
    }),
    createDay({
      number: 13,
      phase: "showcase",
      title: "Demuestra y continúa",
      summary: "Presenta lo que cambió y elige tu siguiente ciclo.",
      mission:
        "Entrega el pitch final, el estado de los tres resultados y un plan de treinta días.",
      outcomeFocus: ["problem", "offer", "sales"],
      requirements: [
        {
          id: "final-pitch",
          label: "Pitch final",
          description: "Narrativa final con evidencia y próximos treinta días.",
          type: "document",
        },
      ],
      evaluators: ["problem", "offer", "sales"],
      estimatedMinutes: 120,
    }),
  ],
}
