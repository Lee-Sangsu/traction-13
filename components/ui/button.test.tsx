import { createRef } from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("forwards its ref to the rendered button", () => {
    const ref = createRef<HTMLButtonElement>()

    render(<Button ref={ref}>Continuar</Button>)

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
