"use client"

import { useState } from "react"
import Image from "next/image"
import { ApplicationButton } from "@/components/application-button"

const scheduleData = [
  {
    number: "01",
    title: "DEFINE",
    duration: "3 days",
    dates: "3 days",
    tagline: "From guesswork to a clear problem",
    description:
      "Three focused days to align on who you serve, the pain worth solving, and the success metric that will steer every decision. You capture signals, sharpen language, and use AI co-pilots to synthesize patterns so everyone points in the same direction.",
    deliverables:
      "a one-page Problem Brief, an insight bank (quotes, signals, patterns), a target snapshot (who/where/why now), a success metric and baseline, a hypothesis backlog, and a lightweight discovery log you can keep running.",
    shortDescription:
      "Lock the who, the pain, and the success metric that will steer the sprint. You finish with a tight Problem Brief everyone can rally around.",
    image: "/img/design.png",
    icon: "/icons/target-circles.svg",
  },
  {
    number: "02",
    title: "BUILD",
    duration: "5 days",
    dates: "5 days",
    tagline: "From insight to a buyable offer",
    description:
      "Five days to turn your problem insight into something people can actually buy. You'll craft a crisp promise, set a sensible price, and design a simple path to 'yes.' Two fast iterations ensure your offer lands in seconds and gives you clean signals when it's time to refine or double down.",
    deliverables:
      "a one-page Offer Brief, pricing model, sales page or pitch deck, mockups or prototype, feedback log from test conversations, and iteration notes showing what changed and why.",
    shortDescription:
      'Shape a crisp promise, sensible price, and a simple path to "yes." Two fast iterations so your offer lands in seconds.',
    image: "/img/build.png",
    icon: "/icons/diamond-dots.svg",
  },
  {
    number: "03",
    title: "SELL",
    duration: "5 days",
    dates: "5 days",
    tagline: "From offer to real proof",
    description:
      "Five days of daily sales loops that turn interest into proof. You'll run outreach, track conversations, handle objections, and collect real outcomes—replies, sign-ups, pre-orders, or sales. With AI as co-pilot, you learn faster from each touchpoint and finish with a light system you can keep running.",
    deliverables:
      "a sales tracker (leads, conversations, outcomes), outreach templates and scripts, objection responses, proof of traction (screenshots, testimonials, commitments), and a post-sprint playbook for continuing momentum.",
    shortDescription:
      "Run daily loops that turn interest into proof, replies, sign-ups, pre-orders or sales, with a light system you can keep.",
    image: "/img/sell.png",
    icon: "/icons/checkmark.svg",
  },
  {
    number: "04",
    title: "SHOWCASE",
    duration: "Event",
    dates: "Last day",
    tagline: "From proof to pitch",
    description:
      "The final event where you present your journey. Five minutes to tell the story of what you built, who you talked to, and what you learned. Five minutes to defend it against questions from partners and peers. A public leaderboard shows who delivered real traction, and prizes up to ₩1,000,000 go to the teams that proved their ideas in the market.",
    deliverables:
      "a pitch deck with your story, demo or screenshots of your offer, traction dashboard with real numbers, lessons learned brief, and stage-ready confidence.",
    shortDescription:
      "Five minutes to tell the story, five to defend it. Public leaderboard, partner eyes on you, and prizes up to ₩1,000,000.",
    image: "/img/showcase.png",
    icon: "/icons/spiral-mandala.svg",
  },
]

export function ScheduleSection() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = scheduleData[selectedIndex]

  return (
    <section className="w-full px-5 sm:px-10 lg:px-20 py-16 md:py-24 bg-[#462efc]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16 flex flex-row items-end">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-anton text-white uppercase mr-2">
            The Schedule
          </h2>
          <p className="text-lg md:text-xl text-white uppercase">13 Days</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Main Define Card */}
          <div className={`rounded-2xl p-6 md:p-8 lg:p-10 text-white relative overflow-hidden ${
            selectedIndex === 3 ? "bg-[#BC1E62]" : "bg-primary"
          }`}>
            <div className="absolute top-6 left-5 md:top-8 md:left-6 text-6xl md:text-7xl font-anton text-white/20">
              {selected.number}
            </div>
            <div className="z-10 mt-8 md:mt-9 mb-2 flex flex-row items-end gap-2">
              <h3 className="text-5xl md:text-6xl font-anton uppercase">{selected.title}</h3>
              <p className="text-base md:text-lg font-anton">{selected.dates}</p>
            </div>
            <p className="text-base md:text-lg font-roboto-bold uppercase py-4 md:py-6 z-10 relative font-bold">
              {selected.tagline}
            </p>
            <div className="relative w-full h-48 md:h-56 mb-6 rounded-2xl overflow-hidden z-10">
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                className="object-cover"
              />
            </div>
            <Image
              src={selected.icon}
              alt={selected.title}
              width={400}
              height={400}
              className="absolute -right-12 -bottom-12 md:-right-16 md:-bottom-16 object-cover opacity-20"
              style={{ filter: 'brightness(0) saturate(100%) invert(92%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(98%) contrast(90%)' }}
            />
            <p className="text-sm md:text-base font-roboto leading-relaxed mb-6 relative z-10">
              {selected.description}
            </p>
            <p className="text-sm md:text-base font-roboto leading-relaxed mb-6 relative z-10">
              <span className="font-bold">You leave with:</span> {selected.deliverables}
            </p>
            <div className="relative z-10">
              <ApplicationButton text="APPLY NOW" variant="outlined" />
            </div>
          </div>

          {/* Small Cards */}
          <div className="space-y-6">
            {scheduleData.map((item, index) => (
              <button
                type="button"
                key={item.number}
                onClick={() => setSelectedIndex(index)}
                className={`w-full relative rounded-2xl p-6 md:p-8 shadow-lg flex flex-col items-start transition-all overflow-hidden ${
                  selectedIndex === index
                    ? index === 3 ? "bg-primary" : "bg-[#A8C2CC]"
                    : "bg-white hover:shadow-xl"
                }`}
              >
                <div className={`absolute top-6 left-5 md:top-8 md:left-6 text-6xl md:text-7xl font-anton ${
                  selectedIndex === index ? "text-white/30" : "text-gray-400/20"
                }`}>
                  {item.number}
                </div>
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={280}
                  height={280}
                  className="absolute -right-4 -top-4 md:-right-6 md:-top-6 object-cover h-[90%] w-auto"
                  style={{ filter: 'brightness(0) saturate(100%) invert(92%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(98%) contrast(90%)' }}
                />
                <div className="z-10 mt-8 md:mt-9 mb-2 flex flex-row items-end gap-2">
                  <h3 className={`text-5xl md:text-6xl font-anton uppercase ${
                    selectedIndex === index ? "text-white" : ""
                  }`}>{item.title}</h3>
                  <p className={`text-base md:text-lg font-anton ${
                    selectedIndex === index ? "text-white" : ""
                  }`}>{item.duration}</p>
                </div>
                <p className={`text-sm md:text-base font-roboto z-10 text-left ${
                  selectedIndex === index ? "text-white" : "text-dark/80"
                }`}>
                  {item.shortDescription}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
