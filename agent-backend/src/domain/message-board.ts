import type {
  AgentIdentity,
  DeliberationMessage,
  DeliberationRound,
  MessageType,
} from "./types.js"
import { deliberationMessageSchema } from "./types.js"

const defaultBudgets: Readonly<Record<MessageType, number>> = {
  finding: 1,
  challenge: 2,
  response: 2,
  revision: 1,
  agreement: 2,
  judge_question: 2,
  judge_result: 1,
}

const nextRound: Readonly<
  Partial<Record<DeliberationRound, DeliberationRound>>
> = {
  independent_evaluation: "challenge_round",
  challenge_round: "revision_round",
  revision_round: "judging",
}

export interface MessageBoardOptions {
  runId: string
  agents: readonly AgentIdentity[]
  budgets?: Partial<Record<MessageType, number>>
}

export interface MessageBoard {
  readonly runId: string
  readonly round: DeliberationRound
  readonly messages: readonly Readonly<DeliberationMessage>[]
  publish(message: DeliberationMessage): MessageBoard
  advanceTo(round: DeliberationRound): MessageBoard
}

class ImmutableMessageBoard implements MessageBoard {
  readonly runId: string
  readonly round: DeliberationRound
  readonly messages: readonly Readonly<DeliberationMessage>[]

  readonly #agents: readonly AgentIdentity[]
  readonly #budgets: Readonly<Record<MessageType, number>>

  constructor(
    options: MessageBoardOptions,
    round: DeliberationRound = "independent_evaluation",
    messages: readonly DeliberationMessage[] = [],
  ) {
    this.runId = options.runId
    this.round = round
    this.#agents = Object.freeze(options.agents.map((agent) => ({ ...agent })))
    this.#budgets = Object.freeze({
      ...defaultBudgets,
      ...options.budgets,
    })
    this.messages = Object.freeze(messages.map((item) => deepFreeze(item)))
  }

  publish(input: DeliberationMessage): MessageBoard {
    const message = deliberationMessageSchema.parse(input)

    if (message.runId !== this.runId) {
      throw new Error("Message run does not match board")
    }
    if (message.round !== this.round) {
      throw new Error("Message round does not match active round")
    }
    if (!this.#isRegistered(message.sender)) {
      throw new Error("Message sender is not registered for this run")
    }
    if (this.messages.some((existing) => existing.id === message.id)) {
      throw new Error("Message ID already exists")
    }

    this.#validateTarget(message)
    this.#validateBudget(message)

    return new ImmutableMessageBoard(
      {
        runId: this.runId,
        agents: this.#agents,
        budgets: this.#budgets,
      },
      this.round,
      [...this.messages, message],
    )
  }

  advanceTo(round: DeliberationRound): MessageBoard {
    if (nextRound[this.round] !== round) {
      throw new Error("Invalid deliberation round transition")
    }
    if (round === "judging") {
      this.#assertChallengesAnswered()
    }

    return new ImmutableMessageBoard(
      {
        runId: this.runId,
        agents: this.#agents,
        budgets: this.#budgets,
      },
      round,
      this.messages,
    )
  }

  #isRegistered(sender: AgentIdentity): boolean {
    return this.#agents.some(
      (agent) =>
        agent.role === sender.role &&
        agent.version === sender.version &&
        agent.provider === sender.provider &&
        agent.model === sender.model,
    )
  }

  #validateBudget(message: DeliberationMessage): void {
    const messagesUsed = this.messages.filter(
      (existing) =>
        existing.sender.role === message.sender.role &&
        existing.sender.version === message.sender.version &&
        existing.type === message.type,
    ).length

    if (messagesUsed >= this.#budgets[message.type]) {
      throw new Error("Agent message budget exceeded")
    }
  }

  #validateTarget(message: DeliberationMessage): void {
    if (message.type === "challenge") {
      const target = this.#target(message.targetMessageId)
      if (target?.type !== "finding") {
        throw new Error("Challenge target does not exist")
      }
      if (target.sender.role === message.sender.role) {
        throw new Error("An agent cannot challenge its own finding")
      }
      return
    }

    if (message.type === "response") {
      const target = this.#target(message.targetMessageId)
      if (target?.type !== "challenge") {
        throw new Error("Response target does not exist")
      }
      const targetedFinding = this.#target(target.targetMessageId)
      if (
        targetedFinding?.type !== "finding" ||
        targetedFinding.sender.role !== message.sender.role ||
        targetedFinding.sender.version !== message.sender.version
      ) {
        throw new Error(
          "Challenge response must come from the targeted agent",
        )
      }
      return
    }

    if (message.type === "revision") {
      const target = this.#target(message.targetMessageId)
      if (
        target?.type !== "finding" ||
        target.sender.role !== message.sender.role
      ) {
        throw new Error("Revision must target the agent's own finding")
      }
      return
    }

    if (message.type === "agreement") {
      const target = this.#target(message.targetMessageId)
      if (target?.type !== "finding") {
        throw new Error("Agreement target does not exist")
      }
    }
  }

  #target(id: string | undefined): Readonly<DeliberationMessage> | undefined {
    return id === undefined
      ? undefined
      : this.messages.find((message) => message.id === id)
  }

  #assertChallengesAnswered(): void {
    const challengeIds = this.messages
      .filter((message) => message.type === "challenge")
      .map((message) => message.id)
    const answeredIds = new Set(
      this.messages
        .filter((message) => message.type === "response")
        .map((message) => message.targetMessageId),
    )

    if (challengeIds.some((id) => !answeredIds.has(id))) {
      throw new Error("Every challenge requires a response")
    }
  }
}

export function createMessageBoard(options: MessageBoardOptions): MessageBoard {
  return new ImmutableMessageBoard(options)
}

function deepFreeze<T extends object>(value: T): Readonly<T> {
  for (const child of Object.values(value)) {
    if (child !== null && typeof child === "object" && !Object.isFrozen(child)) {
      deepFreeze(child)
    }
  }
  return Object.freeze(value)
}
