import { describe, expect, it } from "vitest"
import { createServiceJwt } from "./service-jwt.js"

const secret = "s".repeat(48)

describe("service JWT", () => {
  it("rejects a founder token for an admin operation", async () => {
    const serviceJwt = createServiceJwt({ secret })
    const token = await serviceJwt.sign({
      subject: "next-web",
      organizationId: "organization-1",
      scopes: ["runs:create"],
      founderId: "founder-1",
    })

    await expect(
      serviceJwt.verify(token, { requiredScope: "admin:runs:read" }),
    ).rejects.toThrow("Insufficient service scope")
  })

  it("verifies scope and resource claims", async () => {
    const serviceJwt = createServiceJwt({ secret })
    const token = await serviceJwt.sign({
      subject: "next-web",
      organizationId: "organization-1",
      cohortId: "cohort-1",
      founderId: "founder-1",
      scopes: ["runs:create", "runs:read"],
    })

    const claims = await serviceJwt.verify(token, {
      requiredScope: "runs:read",
      organizationId: "organization-1",
      cohortId: "cohort-1",
      founderId: "founder-1",
    })

    expect(claims.sub).toBe("next-web")
    expect(claims.scopes).toContain("runs:read")
  })

  it("does not issue credentials lasting more than five minutes", async () => {
    const serviceJwt = createServiceJwt({ secret })

    await expect(
      serviceJwt.sign({
        subject: "next-web",
        organizationId: "organization-1",
        scopes: ["runs:create"],
        expiresInSeconds: 301,
      }),
    ).rejects.toThrow("Service JWT lifetime cannot exceed 300 seconds")
  })

  it("rejects access to another founder's resource", async () => {
    const serviceJwt = createServiceJwt({ secret })
    const token = await serviceJwt.sign({
      subject: "next-web",
      organizationId: "organization-1",
      founderId: "founder-1",
      scopes: ["runs:read"],
    })

    await expect(
      serviceJwt.verify(token, {
        requiredScope: "runs:read",
        founderId: "founder-2",
      }),
    ).rejects.toThrow("Service JWT founder does not match resource")
  })
})
