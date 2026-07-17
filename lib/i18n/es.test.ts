import { describe, expect, it } from "vitest"

import { dictionary } from "@/lib/i18n/es"

describe("Spanish product dictionary", () => {
  it("contains the primary founder and admin navigation labels", () => {
    expect(dictionary.founder.navigation.today).toBe("Hoy")
    expect(dictionary.admin.navigation.commandCenter).toBe("Centro de control")
  })
})
