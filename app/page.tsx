import Image from "next/image"
import { Button } from "@/components/ui/button"
import { StudentToast } from "@/components/toast-provider"
import { ScheduleSection } from "@/components/index/schedule-section"

export default function Home() {
  return (
    <main className="w-full min-h-screen pt-20 bg-white">
      <StudentToast />

      {/* Hero Section */}
      <section className="w-full px-5 sm:px-10 lg:px-20 pt-12 md:pt-32 pb-16 md:pb-24 min-h-[72vh] flex items-center justify-center">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="flex justify-center mb-8 md:mb-10">
            <div className="border border-dark rounded-full px-6 md:px-8 py-2.5 md:py-3">
              <p className="text-sm md:text-base font-medium uppercase tracking-wide">
                13 days • AI-assisted • Hybrid • Prize ₩1.5M
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-anton leading-[0.95] tracking-tight text-center mb-8 md:mb-10 uppercase">
            the <span className="text-primary">Shortest</span> <br />
            Distance Between <br />
            Idea and <span className="text-primary">Sales</span>
          </h1>

          {/* Subheading */}
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-10">
            <p className="text-base md:text-xl font-helvetica-bold font-bold mb-2 md:mb-3 uppercase">
              Define. Build. Sell.
            </p>
            <p className="text-base md:text-lg font-helvetica text-dark/90 leading-relaxed">
              A hands-on sprint for students and early founders. In 13 days you'll find a real problem, build a buyable offer, talk to customers, leave with real outcomes. Pitch for multiple prizes, including a ₩1,000,000 top award.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-5 md:py-6 bg-white hover:bg-gray-50 text-dark border border-dark rounded-full uppercase tracking-wide"
            >
              APPLY NOW
            </Button>
            <Button
              size="lg"
              className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-5 md:py-6 bg-primary hover:bg-primary/90 text-white rounded-full uppercase tracking-wide"
            >
              Scholarship
            </Button>
          </div>
        </div>
      </section>

      {/* Photo Collage Section */}
      <section className="w-full px-5 sm:px-10 lg:px-20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-row justify-center flex-wrap gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
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
            <div className="space-y-4">
              <div className="text-5xl md:text-6xl font-anton text-[#462efc]">1</div>
              <h3 className="text-2xl md:text-3xl font-helvetica-bold uppercase">Find the right problem</h3>
              <p className="text-sm md:text-base font-helvetica text-dark/80">
                Build problem-fit you can point to: clear target, real pain, and a success metric that guides choices. You leave with a tight problem brief and shared language, so your team, your messaging, and your customers are finally talking about the same thing.
              </p>
            </div>

            {/* Point 2 */}
            <div className="space-y-4">
              <div className="text-5xl md:text-6xl font-anton text-[#bc1e62]">2</div>
              <h3 className="text-2xl md:text-3xl font-helvetica-bold uppercase">Shape a buyable offer</h3>
              <p className="text-sm md:text-base font-helvetica text-dark/80">
                Turn insight into something people pick quickly: a crisp promise, a sensible price, and a simple path to "yes." The result is an offer that lands in seconds and gives you clean signals when it's time to refine or double down.
              </p>
            </div>

            {/* Point 3 */}
            <div className="space-y-4">
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
              <div className="sticky top-20 space-y-4 max-w-sm">
                <div className="text-6xl font-anton text-[#462efc]">1</div>
                <h3 className="text-3xl font-helvetica-bold uppercase">Find the right problem</h3>
                <p className="text-base font-helvetica text-dark/80">
                  Build problem-fit you can point to: clear target, real pain, and a success metric that guides choices. You leave with a tight problem brief and shared language, so your team, your messaging, and your customers are finally talking about the same thing.
                </p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="relative w-full h-full flex items-start pt-[316px]">
              <div className="sticky top-[316px] space-y-4 max-w-sm">
                <div className="text-6xl font-anton text-[#bc1e62]">2</div>
                <h3 className="text-3xl font-helvetica-bold uppercase">Shape a buyable offer</h3>
                <p className="text-base font-helvetica text-dark/80">
                  Turn insight into something people pick quickly: a crisp promise, a sensible price, and a simple path to "yes." The result is an offer that lands in seconds and gives you clean signals when it's time to refine or double down.
                </p>
              </div>
            </div>

            {/* Point 3 */}
            <div className="relative w-full h-full flex items-start pt-[632px]">
              <div className="sticky top-[632px] space-y-4 max-w-sm">
                <div className="text-6xl font-anton text-[#ffe35c]">3</div>
                <h3 className="text-3xl font-helvetica-bold uppercase">Run a daily sales loop</h3>
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
      <section className="w-full bg-[#000405] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto relative px-5 sm:px-10 lg:px-20 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-0 z-10">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-anton uppercase mb-6">
                Everything you <br />
                need to <span className="text-primary">ship</span>
              </h2>
              <p className="text-sm md:text-base font-mono uppercase mb-8 md:mb-12">
                For only ₩75,000 until November 1
              </p>

              <div className="mb-8 md:mb-12">
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
            <div className="flex flex-col items-start justify-end pb-8 md:pb-12">
              <div className="flex flex-col w-fit items-center justify-center">
                {/* Scholarship */}
                <div className="bg-white/40 text-black backdrop-blur-[20px] rounded-[44px] p-6 flex items-start justify-between h-[88px] w-[320px] z-10 relative">
                  <p className="text-sm font-helvetica-bold">Scholarship</p>
                  <p className="text-sm font-helvetica line-through uppercase">₩75.000</p>
                </div>

                {/* Main Slot - Save your slot */}
                <div className="bg-white rounded-[45.5px] p-6 flex items-center justify-between shadow-md h-[88px] w-[360px] z-30 relative -mt-10">
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-[45.5px] px-8 py-4 h-[60px] font-mono font-bold uppercase text-sm">
                    Save your slot
                  </Button>
                  <div className="text-right text-black">
                    <p className="text-sm font-helvetica-bold uppercase leading-tight">special price</p>
                    <p className="text-xl font-helvetica-bold text-primary leading-tight">₩75.000</p>
                  </div>
                </div>

                {/* Last Chance */}
                <div className="bg-white/40 text-black backdrop-blur-[20px] rounded-[44px] p-6 flex items-end justify-between shadow-[0px_4px_4px_rgba(0,0,0,0.1)] h-[88px] w-[320px] z-20 relative -mt-10">
                  <div className="flex items-center gap-3">
                    <p className="text-base font-helvetica-bold">Last Change</p>
                    <p className="text-sm font-mono">Nov 1</p>
                  </div>
                  <p className="text-sm font-helvetica uppercase">₩120.000</p>
                </div>

                {/* After Nov 10 */}
                <div className="bg-white/36 text-black backdrop-blur-[20px] rounded-[44px] p-6 flex items-end justify-between h-[88px] w-[280px] z-10 relative -mt-10">
                  <p className="text-sm font-bold">After Nov 10</p>
                  <p className="text-sm font-helvetica uppercase">₩220.000</p>
                </div>
              </div>
            </div>
          </div>
          {/* Background Image - Desktop only */}
          <div className="hidden md:block absolute -right-20 top-1/2 -translate-y-1/2 h-full">
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
      <section className="w-full px-5 sm:px-10 lg:px-20 py-16 md:py-24 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-block bg-[#462efc] rounded-full px-6 py-2 mb-8">
                <p className="text-sm md:text-base font-mono uppercase">AI SUPPORT</p>
              </div>

              <h2 className="text-4xl md:text-5xl font-anton uppercase mb-6 leading-tight">
                Your AI stack, ready from day 1.
              </h2>

              <p className="text-base md:text-lg font-helvetica-bold uppercase mb-6">
                Two parts working together: instant guidance + on-demand assistants.
              </p>

              <div className="space-y-4 text-sm md:text-base font-helvetica mb-8">
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

              <Button
                className="bg-transparent hover:bg-white/10 text-white border border-white rounded-full px-8 py-6 font-mono uppercase text-sm"
              >
                APPLY NOW
              </Button>
            </div>

            {/* Right Content - Placeholder for AI Chat Interface */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-xl h-[400px] md:h-[500px]">
                {/* Placeholder for chat interface */}
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-8 -right-4 bg-[#462efc] rounded-2xl p-4 shadow-lg max-w-xs">
                <p className="text-2xl md:text-3xl font-anton text-white mb-1">6 tracks</p>
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
      <section className="w-full px-5 sm:px-10 lg:px-20 py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-base md:text-lg font-mono uppercase text-center mb-12">
            Brands we've collaborated with
          </p>

          {/* Logo Grid - Placeholder */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center mb-16 opacity-60">
            <div className="h-12 w-24 bg-gray-200 rounded"></div>
            <div className="h-12 w-24 bg-gray-200 rounded"></div>
            <div className="h-12 w-24 bg-gray-200 rounded"></div>
            <div className="h-12 w-24 bg-gray-200 rounded"></div>
            <div className="h-12 w-24 bg-gray-200 rounded"></div>
          </div>

          <h2 className="text-3xl md:text-5xl font-anton uppercase text-center mb-6">
            Interested In Partner with us?
          </h2>

          <p className="text-base md:text-lg font-helvetica text-center mb-8 max-w-3xl mx-auto">
            <span className="font-bold uppercase">Co-partner in Traction 13!</span><br />
            Put your brand, tools, and support entrepreneurs to reach their dreams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              className="w-full sm:w-auto bg-transparent hover:bg-gray-50 text-dark border border-dark rounded-full px-8 py-6 font-mono uppercase text-sm"
            >
              Become a partner
            </Button>
            <Button
              className="w-full sm:w-auto bg-[#462efc] hover:bg-[#462efc]/90 text-white rounded-full px-8 py-6 font-mono uppercase text-sm"
            >
              Become a SPonsor
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
