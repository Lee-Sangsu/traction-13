import { randomUUID } from "node:crypto"
import { jwtVerify, SignJWT } from "jose"
import { z } from "zod"
import {
  resourceIdSchema,
  serviceScopeSchema,
  type ServiceScope,
} from "../contracts/common.js"

const DEFAULT_ISSUER = "traction13-web"
const DEFAULT_AUDIENCE = "traction13-agent-backend"
const MAX_LIFETIME_SECONDS = 300

const serviceClaimsSchema = z.object({
  sub: resourceIdSchema,
  iat: z.number().int(),
  exp: z.number().int(),
  jti: resourceIdSchema,
  organization_id: resourceIdSchema,
  cohort_id: resourceIdSchema.optional(),
  founder_id: resourceIdSchema.optional(),
  scopes: z.array(serviceScopeSchema).min(1),
})

export interface ServiceJwtOptions {
  secret: string
  issuer?: string
  audience?: string
  now?: () => number
}

export interface SignServiceJwtInput {
  subject: string
  organizationId: string
  cohortId?: string
  founderId?: string
  scopes: ServiceScope[]
  expiresInSeconds?: number
}

export interface VerifyServiceJwtInput {
  requiredScope: ServiceScope
  organizationId?: string
  cohortId?: string
  founderId?: string
}

export interface VerifiedServiceClaims {
  sub: string
  jti: string
  organizationId: string
  cohortId?: string
  founderId?: string
  scopes: ServiceScope[]
  issuedAt: number
  expiresAt: number
}

export function createServiceJwt(options: ServiceJwtOptions) {
  if (options.secret.length < 48) {
    throw new Error("Service JWT secret must contain at least 48 characters")
  }

  const issuer = options.issuer ?? DEFAULT_ISSUER
  const audience = options.audience ?? DEFAULT_AUDIENCE
  const key = new TextEncoder().encode(options.secret)
  const now = options.now ?? (() => Math.floor(Date.now() / 1_000))

  return {
    async sign(input: SignServiceJwtInput): Promise<string> {
      const lifetime = input.expiresInSeconds ?? MAX_LIFETIME_SECONDS
      if (lifetime < 1 || lifetime > MAX_LIFETIME_SECONDS) {
        throw new Error(
          `Service JWT lifetime cannot exceed ${MAX_LIFETIME_SECONDS} seconds`,
        )
      }

      const issuedAt = now()
      return new SignJWT({
        organization_id: input.organizationId,
        cohort_id: input.cohortId,
        founder_id: input.founderId,
        scopes: input.scopes,
      })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuer(issuer)
        .setAudience(audience)
        .setSubject(input.subject)
        .setJti(randomUUID())
        .setIssuedAt(issuedAt)
        .setExpirationTime(issuedAt + lifetime)
        .sign(key)
    },

    async verify(
      token: string,
      expected: VerifyServiceJwtInput,
    ): Promise<VerifiedServiceClaims> {
      const { payload } = await jwtVerify(token, key, {
        issuer,
        audience,
        algorithms: ["HS256"],
        requiredClaims: ["sub", "iat", "exp", "jti"],
      })
      const claims = serviceClaimsSchema.parse(payload)

      if (claims.exp - claims.iat > MAX_LIFETIME_SECONDS) {
        throw new Error("Service JWT lifetime exceeds five minutes")
      }
      if (!claims.scopes.includes(expected.requiredScope)) {
        throw new Error("Insufficient service scope")
      }
      assertResourceMatch(
        "organization",
        expected.organizationId,
        claims.organization_id,
      )
      assertResourceMatch("cohort", expected.cohortId, claims.cohort_id)
      assertResourceMatch("founder", expected.founderId, claims.founder_id)

      return {
        sub: claims.sub,
        jti: claims.jti,
        organizationId: claims.organization_id,
        cohortId: claims.cohort_id,
        founderId: claims.founder_id,
        scopes: claims.scopes,
        issuedAt: claims.iat,
        expiresAt: claims.exp,
      }
    },
  }
}

function assertResourceMatch(
  resource: "organization" | "cohort" | "founder",
  expected: string | undefined,
  actual: string | undefined,
): void {
  if (expected !== undefined && actual !== expected) {
    throw new Error(`Service JWT ${resource} does not match resource`)
  }
}
