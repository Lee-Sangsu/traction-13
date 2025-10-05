"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DialogFooter, DialogHeader } from "./ui/dialog"
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
          <div className="flex items-center gap-3 md:gap-4">
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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90 text-white font-mono uppercase text-sm md:text-lg px-6 md:px-8 py-2 md:py-3 rounded-full transition-all duration-200 hover:scale-105"
                >
                  APPLY NOW
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply Now</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Apply now to join the 13-day challenge.
                </DialogDescription>
                <DialogFooter>
                  <Button className="bg-primary hover:bg-primary/90 text-white font-mono uppercase px-8 py-3 rounded-full">
                    Apply Now
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white font-mono uppercase text-sm px-6 py-3 rounded-full"
                >
                  APPLY NOW
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply Now</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <p>
                    Apply now to join the 13-day challenge.
                  </p>
                </DialogDescription>
                <DialogFooter>
                  <Button className="bg-primary hover:bg-primary/90 text-white font-mono uppercase px-8 py-3 rounded-full">
                    Apply Now
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </nav>
        )}
      </div>
    </header>
  )
}
