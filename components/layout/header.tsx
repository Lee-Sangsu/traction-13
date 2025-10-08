"use client"

import { ApplicationButton } from "@/components/application-button"
import { Menu } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/10 backdrop-blur-sm">
      <div className="w-full mx-auto px-5 sm:px-10 lg:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <Image src='/logo-icon.png'
                alt="Traction 13 Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <h1 className="text-xl md:text-2xl font-anton text-foreground uppercase leading-none">
              Traction 13
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-foreground">
            <a href="#why" className="hover:text-primary transition-colors">
              Why
            </a>
            <a href="#schedule" className="hover:text-primary transition-colors">
              Schedule
            </a>
            <a href="#what-you-get" className="hover:text-primary transition-colors">
              What you get
            </a>
            <a href="#ai-support" className="hover:text-primary transition-colors">
              AI support
            </a>
            <a href="#faq" className="hover:text-primary transition-colors">
              FAQ
            </a>
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <ApplicationButton text="APPLY NOW" variant="primary" />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-100 space-y-4 font-helvetica text-sm">
            <a
              href="#why"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Why
            </a>
            <a
              href="#schedule"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Schedule
            </a>
            <a
              href="#what-you-get"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              What you get
            </a>
            <a
              href="#ai-support"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              AI support
            </a>
            <a
              href="#faq"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <ApplicationButton text="APPLY NOW" variant="primary" />
          </nav>
        )}
      </div>
    </header>
  )
}
