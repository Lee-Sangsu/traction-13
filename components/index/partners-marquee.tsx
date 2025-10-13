'use client'

import { useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"

interface PartnerLogo {
  src: string
  alt: string
}

interface PartnersMarqueeProps {
  logos: PartnerLogo[]
}

export function PartnersMarquee({ logos }: PartnersMarqueeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const duplicatedLogos = useMemo(() => [...logos, ...logos], [logos])

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    let marqueeTween: gsap.core.Tween | null = null
    let resizeRaf = 0
    const buildMarquee = () => {
      marqueeTween?.kill()
      const distance = track.scrollWidth / 2
      if (!distance) return

      gsap.set(track, { x: 0 })
      marqueeTween = gsap.fromTo(
        track,
        { x: 0 },
        {
          x: -distance,
          duration: Math.max(distance / 80, 18),
          ease: "none",
          repeat: -1,
        }
      )
    }

    const scheduleBuild = () => {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(buildMarquee)
    }

    scheduleBuild()
    window.addEventListener("resize", scheduleBuild)
    window.addEventListener("load", scheduleBuild)
    const resizeObserver =
      "ResizeObserver" in window ? new ResizeObserver(scheduleBuild) : null
    resizeObserver?.observe(container)

    return () => {
      window.removeEventListener("resize", scheduleBuild)
      window.removeEventListener("load", scheduleBuild)
      cancelAnimationFrame(resizeRaf)
      marqueeTween?.kill()
      resizeObserver?.disconnect()
    }
  }, [logos.length])

  return (
    <div ref={containerRef} className="partners-logos relative mb-16 overflow-hidden">
      <div ref={trackRef} className="partners-marquee-track flex items-center gap-10 py-4 will-change-transform">
        {duplicatedLogos.map((logo, index) => {
          const isDuplicate = index >= logos.length
          return (
            <div
              key={`${logo.alt}-${index}`}
              className="partner-logo flex h-20 min-w-[180px] flex-shrink-0 items-center justify-center px-6"
              aria-hidden={isDuplicate}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={200}
                height={80}
                className="h-12 w-auto max-w-[180px] object-contain"
              />
            </div>
          )
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white to-transparent" />
    </div>
  )
}
