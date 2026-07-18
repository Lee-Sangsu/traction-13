import { z } from "zod"

const booleanFromEnvironment = z
  .enum(["0", "1", "false", "true"])
  .default("0")
  .transform((value) => value === "1" || value === "true")

const configSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().min(1).default("127.0.0.1"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(4100),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  DATABASE_URL: z.url(),
  SERVICE_JWT_SECRET: z.string().min(48),
  AGENT_PROVIDER: z.enum(["deterministic", "codex", "claude"]).default("deterministic"),
  PROVIDER_CONCURRENCY: z.coerce.number().int().min(1).max(16).default(2),
  PROVIDER_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(1_000)
    .max(900_000)
    .default(120_000),
  CODEX_HOME: z.string().min(1).default("/var/lib/traction-agent/codex"),
  CLAUDE_CONFIG_DIR: z
    .string()
    .min(1)
    .default("/var/lib/traction-agent/claude"),
  RUN_LIVE_SUBSCRIPTION_TESTS: booleanFromEnvironment,
})

export type BackendConfig = {
  environment: z.infer<typeof configSchema>["NODE_ENV"]
  host: string
  port: number
  logLevel: z.infer<typeof configSchema>["LOG_LEVEL"]
  databaseUrl: string
  serviceJwtSecret: string
  provider: z.infer<typeof configSchema>["AGENT_PROVIDER"]
  providerConcurrency: number
  providerTimeoutMs: number
  codexHome: string
  claudeConfigDir: string
  runLiveSubscriptionTests: boolean
}

export function parseConfig(
  environment: Record<string, string | undefined>,
): BackendConfig {
  const parsed = configSchema.parse(environment)

  return {
    environment: parsed.NODE_ENV,
    host: parsed.HOST,
    port: parsed.PORT,
    logLevel: parsed.LOG_LEVEL,
    databaseUrl: parsed.DATABASE_URL,
    serviceJwtSecret: parsed.SERVICE_JWT_SECRET,
    provider: parsed.AGENT_PROVIDER,
    providerConcurrency: parsed.PROVIDER_CONCURRENCY,
    providerTimeoutMs: parsed.PROVIDER_TIMEOUT_MS,
    codexHome: parsed.CODEX_HOME,
    claudeConfigDir: parsed.CLAUDE_CONFIG_DIR,
    runLiveSubscriptionTests: parsed.RUN_LIVE_SUBSCRIPTION_TESTS,
  }
}
