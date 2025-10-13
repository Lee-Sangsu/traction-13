'use client'

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { StudentToast } from "@/components/toast-provider"
import { ScheduleSection } from "@/components/index/schedule-section"
import { ApplicationButton } from "@/components/application-button"
import { PartnersMarquee } from "@/components/index/partners-marquee"

const PARTNER_LOGOS = [
  { file: "LOGO_LEINNINTERNATIONAL_NEGRO (1) 1.png", alt: "LEINN International logo" },
  { file: "Logos _Mesa de trabajo 1-01 1.png", alt: "Mesa de Trabajo partner logo" },
  { file: "ean.png", alt: "EAN University logo" },
  { file: "externado.png", alt: "Externado University logo" },
  { file: "image 12.png", alt: "Partner logo 12" },
  { file: "image 14.png", alt: "Partner logo 14" },
  { file: "image 17.png", alt: "Partner logo 17" },
  { file: "image 18.png", alt: "Partner logo 18" },
].map(({ file, alt }) => ({
  src: encodeURI(`/img/partner-logos/${file}`),
  alt,
}))

export function HomeContent() {
  const mainRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!mainRef.current) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } })

      heroTimeline
        .from(".hero-badge", { y: -24, opacity: 0, duration: 0.6 })
        .from(".hero-heading", { y: 48, opacity: 0, duration: 0.9 }, "-=0.3")
        .from(".hero-subheading", { y: 36, opacity: 0, duration: 0.7 }, "-=0.4")
        .from(".hero-cta", { y: 24, opacity: 0, duration: 0.5, stagger: 0.12 }, "-=0.3")

      gsap.from(".collage-item", {
        opacity: 0,
        y: 72,
        rotate: () => gsap.utils.random(-10, 10),
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".collage-grid",
          start: "top 85%",
        },
      })

      gsap.utils.toArray<HTMLElement>(".why-point").forEach((point) => {
        gsap.from(point, {
          opacity: 0,
          y: 56,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: point,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      })

      gsap.utils.toArray<HTMLElement>(".stagger-trigger").forEach((trigger) => {
        const items = trigger.querySelectorAll<HTMLElement>(".stagger-item")
        if (!items.length) return

        gsap.from(items, {
          opacity: 0,
          y: 32,
          duration: 0.75,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        })
      })

      gsap.from(".ai-floating-card", {
        opacity: 0,
        y: 36,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ai-section",
          start: "top 75%",
        },
      })

      gsap.from(".partners-logos .partner-logo", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: ".partners-section",
          start: "top 80%",
        },
      })

      gsap.from(".partner-cta", {
        opacity: 0,
        y: 28,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".partners-section",
          start: "top 70%",
        },
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={mainRef} className="w-full min-h-screen pt-20 bg-white">
      <StudentToast />

      {/* Hero Section */}
      <section className="w-full px-5 sm:px-10 lg:px-20 pt-12 md:pt-32 pb-16 md:pb-24 min-h-[72vh] flex items-center justify-center">
        <div className="max-w-3xl hero-content">
          {/* Badge */}
          <div className="flex justify-center mb-8 md:mb-10 hero-badge">
            <div className="border border-dark rounded-full px-4 md:px-8 py-2 md:py-3 text-center">
              <p className="text-xs md:text-base font-medium uppercase tracking-wide">
                13 days • AI-assisted • Hybrid • Prize ₩1.5M
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-anton leading-[0.95] tracking-tight text-center mb-8 md:mb-10 uppercase hero-heading">
            the <span className="text-primary">Shortest</span> <br />
            Distance Between <br />
            Idea and <span className="text-primary">Sales</span>
          </h1>

          {/* Subheading */}
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-10 hero-subheading">
            <p className="text-base md:text-xl font-helvetica-bold font-bold mb-2 md:mb-3 uppercase">
              Define. Build. Sell.
            </p>
            <p className="text-base md:text-lg font-helvetica text-dark/90 leading-relaxed">
              A hands-on sprint for students and early founders. In 13 days you'll find a real problem, build a buyable offer, talk to customers, leave with real outcomes. Pitch for multiple prizes, including a ₩1,000,000 top award.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-ibm-plex-mono">
            <div className="hero-cta">
              <ApplicationButton text="APPLY NOW" variant="primary" />
            </div>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-5 md:py-6 rounded-full uppercase tracking-wide hero-cta"
            >
              Scholarship
            </Button>
          </div>
        </div>
      </section>

      {/* Photo Collage Section */}
      <section className="w-full px-5 sm:px-10 lg:px-20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-row justify-center flex-wrap gap-3 md:gap-4 collage-grid">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="relative h-48 md:h-64 rounded-2xl overflow-hidden collage-item">
                <Image
                  src={`/img/main-${i}.png`}
                  alt={`Traction 13 photo ${i}`}
                  width={300}
                  height={256}
                  className="object-cover h-full w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="w-full px-5 sm:px-10 lg:px-20 py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-anton text-center mb-4 uppercase leading-tight">
            There's more than one way <br/>
            to build traction
          </h2>
          <p className="text-base md:text-lg font-helvetica text-center max-w-4xl mx-auto mb-16 md:mb-20 text-dark/90">
            Forget theory marathons. We focus on three core skills: finding the problem worth solving, shaping an offer people get in seconds, and testing sales daily. We provide the templates, AI co-pilots, and review moments; you provide the action.
          </p>

          {/* Mobile: Grid layout */}
          <div className="grid grid-cols-1 gap-8 md:hidden">
            {/* Point 1 */}
            <div className="space-y-4 why-point">
              <div className="text-5xl md:text-6xl font-anton text-[#462efc]">1</div>
              <h3 className="text-2xl md:text-3xl font-helvetica-bold uppercase">Find the right problem</h3>
              <p className="text-sm md:text-base font-helvetica text-dark/80">
                Build problem-fit you can point to: clear target, real pain, and a success metric that guides choices. You leave with a tight problem brief and shared language, so your team, your messaging, and your customers are finally talking about the same thing.
              </p>
            </div>

            {/* Point 2 */}
            <div className="space-y-4 why-point">
              <div className="text-5xl md:text-6xl font-anton text-[#bc1e62]">2</div>
              <h3 className="text-2xl md:text-3xl font-helvetica-bold uppercase">Shape a buyable offer</h3>
              <p className="text-sm md:text-base font-helvetica text-dark/80">
                Turn insight into something people pick quickly: a crisp promise, a sensible price, and a simple path to "yes." The result is an offer that lands in seconds and gives you clean signals when it's time to refine or double down.
              </p>
            </div>

            {/* Point 3 */}
            <div className="space-y-4 why-point">
              <div className="text-5xl md:text-6xl font-anton text-[#ffe35c]">3</div>
              <h3 className="text-2xl md:text-3xl font-helvetica-bold uppercase">Run a daily sales loop</h3>
              <p className="text-sm md:text-base font-helvetica text-dark/80">
                A system you can keep running. With AI as co-pilot, you track leads and conversations, learn faster from each touchpoint, and finish with visible proof and a story that holds up on stage.
              </p>
            </div>
          </div>

          {/* Desktop: Sticky diagonal layout */}
          <div className="hidden md:flex flex-row space-x-8 h-[900px]">
            {/* Point 1 */}
            <div className="relative w-full h-full flex items-start">
              <div className="sticky top-20 space-y-4 max-w-sm why-point">
                <div className="flex flex-row items-center gap-4">
                  <span className="text-[#462efc] text-7xl font-anton">1</span>
                  <h3 className="text-3xl font-helvetica-bold uppercase leading-tight">Find the right problem</h3>
                </div>
                <p className="text-base font-helvetica text-dark/80">
                  Build problem-fit you can point to: clear target, real pain, and a success metric that guides choices. You leave with a tight problem brief and shared language, so your team, your messaging, and your customers are finally talking about the same thing.
                </p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="relative w-full h-full flex items-start pt-[316px]">
              <div className="sticky top-[316px] space-y-4 max-w-sm why-point">
                <div className="flex flex-row items-center gap-4">
                  <span className="text-[#bc1e62] text-7xl font-anton">2</span>
                  <h3 className="text-3xl font-helvetica-bold uppercase leading-tight">Shape a buyable offer</h3>
                </div>
                <p className="text-base font-helvetica text-dark/80">
                  Turn insight into something people pick quickly: a crisp promise, a sensible price, and a simple path to "yes." The result is an offer that lands in seconds and gives you clean signals when it's time to refine or double down.
                </p>
              </div>
            </div>

            {/* Point 3 */}
            <div className="relative w-full h-full flex items-start pt-[632px]">
              <div className="sticky top-[632px] space-y-4 max-w-sm why-point">
                <div className="flex flex-row items-center gap-4">
                  <span className="text-[#ffe35c] text-7xl font-anton">3</span>
                  <h3 className="text-3xl font-helvetica-bold uppercase leading-tight">Run a daily sales loop</h3>
                </div>
                <p className="text-base font-helvetica text-dark/80">
                  A system you can keep running. With AI as co-pilot, you track leads and conversations, learn faster from each touchpoint, and finish with visible proof and a story that holds up on stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScheduleSection />

      {/* Everything You Need Section */}
      <section className="w-full bg-[#000405] text-white overflow-hidden stagger-trigger ship-section">
        <div className="max-w-7xl mx-auto relative px-5 sm:px-10 lg:px-20 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-0 z-10">
            {/* Left Content */}
            <div className="z-10">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-anton uppercase mb-6 stagger-item">
                Everything you <br />
                need to <span className="text-primary">ship</span>
              </h2>
              <p className="text-sm md:text-base font-ibm-plex-mono uppercase mb-8 md:mb-12 stagger-item">
                For only ₩75,000 until November 1
              </p>

              <div className="mb-8 md:mb-12 stagger-item">
                <p className="text-base md:text-lg font-helvetica-bold uppercase mb-4">What you get</p>
                <ul className="space-y-3 text-sm md:text-base font-helvetica">
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Labs in Seoul and focused co-working blocks.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Online modules and templates with year access.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Showcase and networking event.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>AI-assisted Toolbox Kit for research, offer, outreach, and tracking.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary">✓</span>
                    <span>Market proof you can show: interviews, MVP, sign-ups or sales.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Pricing */}
            <div className="flex flex-col items-start justify-end pb-8 md:pb-12 stagger-item">
              <div className="flex flex-col w-fit items-center justify-center">
                {/* Scholarship */}
                <div className="bg-white/40 text-black backdrop-blur-[20px] rounded-4xl p-6 flex items-start justify-between h-[88px] w-[320px] z-10 relative stagger-item">
                  <p className="text-sm font-helvetica-bold">Scholarship</p>
                  <p className="text-sm font-helvetica line-through uppercase">₩75.000</p>
                </div>

                {/* Main Slot - Save your slot */}
                <div className="bg-white rounded-[45.5px] p-6 flex items-center justify-between shadow-md h-[88px] w-[360px] z-30 relative -mt-10 stagger-item">
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-[45.5px] px-8 py-4 h-[60px] font-mono font-bold uppercase text-sm">
                    Save your slot
                  </Button>
                  <div className="text-right text-black">
                    <p className="text-sm font-helvetica-bold uppercase leading-tight">special price</p>
                    <p className="text-xl font-helvetica-bold text-primary leading-tight">₩75.000</p>
                  </div>
                </div>

                {/* Last Chance */}
                <div className="bg-white/40 text-black backdrop-blur-[20px] rounded-4xl p-6 flex items-end justify-between shadow-[0px_4px_4px_rgba(0,0,0,0.1)] h-[88px] w-[320px] z-20 relative -mt-10 stagger-item">
                  <div className="flex items-center gap-3">
                    <p className="text-base font-helvetica-bold">Last Change</p>
                    <p className="text-sm font-mono">Nov 1</p>
                  </div>
                  <p className="text-sm font-helvetica uppercase">₩120.000</p>
                </div>

                {/* After Nov 10 */}
                <div className="bg-white/36 text-black backdrop-blur-[20px] rounded-4xl p-6 flex items-end justify-between h-[88px] w-[280px] z-10 relative -mt-10 stagger-item">
                  <p className="text-sm font-bold">After Nov 10</p>
                  <p className="text-sm font-helvetica uppercase">₩220.000</p>
                </div>
              </div>
            </div>
          </div>
          {/* Background Image - Desktop only */}
          <div className="hidden md:block absolute -right-20 top-1/2 -translate-y-1/2 h-full z-0">
            <Image
              src="/img/girl-grabbing.png"
              alt="Traction 13"
              width={600}
              height={800}
              className="object-contain h-full w-auto"
            />
          </div>
        </div>
      </section>

      {/* AI Support Section */}
      <section className="w-full py-12 md:py-16 px-5 ai-section stagger-trigger">
        <div className="max-w-7xl mx-auto bg-primary rounded-4xl px-5 md:px-20 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-block bg-[#462efc] rounded-full px-6 py-2 mb-8 stagger-item">
                <p className="text-sm md:text-base font-mono uppercase">AI SUPPORT</p>
              </div>

              <h2 className="text-4xl md:text-5xl font-anton uppercase mb-6 leading-tight stagger-item">
                Your AI stack, ready from day 1.
              </h2>

              <p className="text-base md:text-lg font-helvetica-bold uppercase mb-6 stagger-item">
                Two parts working together: instant guidance + on-demand assistants.
              </p>

              <div className="space-y-4 text-sm md:text-base font-helvetica mb-8 stagger-item">
                <p>
                  <span className="italic">Stuck?</span> Get instant guidance that understands your project, suggests the next step, and opens the right template or module.
                </p>
                <p>
                  <span className="italic">Ready to produce?</span> On-demand assistants draft real asset and drop them into fillable templates you can adapt fast.
                </p>
                <p>
                  You'll also learn to brief and iterate with quick prompt playbooks.
                </p>
              </div>

              <div className="stagger-item">
                <ApplicationButton text="APPLY NOW" variant="outlined" />
              </div>
            </div>

            {/* Right Content - Placeholder for AI Chat Interface */}
            <div className="relative stagger-item">
              <div className="h-96 md:h-full">
                {/* Placeholder for chat interface */}
                <Image src='/img/ai-support.png' alt="AI Support" 
                  width={649} height={656} 
                  className="object-cover h-full w-auto" />
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-8 -right-4 bg-[#462efc] rounded-2xl p-4 shadow-lg max-w-xs ai-floating-card">
                <p className="text-2xl md:text-3xl font-anton text-white mb-1 uppercase">6 tracks</p>
                <p className="text-xs font-helvetica-bold uppercase text-white mb-2">dozens of templates in</p>
                <p className="text-xs font-helvetica text-white">
                  Problem • Research • MVP • Rebrand • Marketing • Sales/Contracts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="w-full px-5 sm:px-10 lg:px-20 py-16 md:py-24 bg-white partners-section stagger-trigger">
        <div className="max-w-6xl mx-auto">
          <p className="text-base md:text-lg font-ibm-plex-mono uppercase text-center mb-12">
            Brands we've collaborated with
          </p>

          <PartnersMarquee logos={PARTNER_LOGOS} />

          <h2 className="text-3xl md:text-5xl font-anton uppercase text-center mb-6">
            Interested In Partner with us?
          </h2>

          <p className="text-base md:text-lg font-helvetica text-center mb-8 max-w-3xl mx-auto">
            <span className="font-bold uppercase">Co-partner in Traction 13!</span><br />
            Put your brand, tools, and support entrepreneurs to reach their dreams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              className="w-full sm:w-auto bg-transparent hover:bg-gray-50 text-dark border border-dark rounded-full px-8 py-6 font-mono uppercase text-sm partner-cta stagger-item"
            >
              Become a partner
            </Button>
            <Button
              className="w-full sm:w-auto bg-[#462efc] hover:bg-[#462efc]/90 text-white rounded-full px-8 py-6 font-mono uppercase text-sm partner-cta stagger-item"
            >
              Become a SPonsor
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
