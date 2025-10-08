import type React from "react"
import type { Metadata } from "next"
import { Anton, Roboto, IBM_Plex_Mono } from "next/font/google"
// import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/sonner"

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
})

const helvetica = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  variable: "--font-helvetica",
  fallback: ["Helvetica Neue", "sans-serif"],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  variable: "--font-ibm-plex-mono",
})

export const metadata: Metadata = {
  title: "Traction 13 — Evidence over opinions",
  description:
    "A 13-day, AI-assisted challenge where students and early founders go from problem → offer → sales → showcase. Real buyers, or it doesn't count.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${anton.variable} ${helvetica.variable} ${ibmPlexMono.variable}`}>
        <Header />
        <Suspense fallback={null}>{children}</Suspense>
        <Footer />
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
