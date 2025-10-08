"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface ApplicationButtonProps {
  text?: string
  variant?: "primary" | "outlined"
}

export function ApplicationButton({ text = "APPLY NOW", variant = "primary" }: ApplicationButtonProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission here
    setOpen(false)
  }

  const buttonClasses =
    variant === "primary"
      ? "bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 font-ibm-plex-mono uppercase text-sm md:text-base tracking-wide"
      : "hover:bg-white hover:text-black border border-dark rounded-full px-8 py-6 font-ibm-plex-mono uppercase text-sm md:text-base tracking-wide"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClasses}>{text}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-anton uppercase">Apply for Traction 13</DialogTitle>
          <DialogDescription className="font-helvetica">
            Join the 13-day sprint to turn your idea into real traction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-helvetica-bold">
              Full Name
            </label>
            <Input id="name" name="name" placeholder="Your name" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-helvetica-bold">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="your@email.com" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-helvetica-bold">
              Phone Number
            </label>
            <Input id="phone" name="phone" type="tel" placeholder="+82 10-1234-5678" />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-6 font-mono uppercase tracking-wide"
          >
            Submit Application
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
