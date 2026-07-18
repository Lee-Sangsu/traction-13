import { describe, expect, it } from "vitest"

import { parseConfig } from "./config.js"

describe("backend configuration", () => {
  it("uses safe private-testing defaults", () => {
    const config = parseConfig({
      NODE_ENV: "test",
      SERVICE_JWT_SECRET: "a".repeat(48),
      DATABASE_URL: "postgres://localhost/traction_agent_test",
    })

    expect(config.provider).toBe("deterministic")
    expect(config.providerConcurrency).toBe(2)
    expect(config.port).toBe(4100)
    expect(config.host).toBe("127.0.0.1")
  })

  it("rejects a short service JWT secret", () => {
    expect(() =>
      parseConfig({
        NODE_ENV: "test",
        SERVICE_JWT_SECRET: "too-short",
        DATABASE_URL: "postgres://localhost/traction_agent_test",
      }),
    ).toThrow()
  })
})
