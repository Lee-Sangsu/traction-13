import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import MarketingLayout from "@/app/(marketing)/layout"

describe("Marketing layout", () => {
  it("keeps the public navigation around landing-page content", () => {
    render(
      <MarketingLayout>
        <main>Contenido público</main>
      </MarketingLayout>,
    )

    expect(screen.getByText("Traction 13")).toBeInTheDocument()
    expect(screen.getByText("Contenido público")).toBeInTheDocument()
  })
})
