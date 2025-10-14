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
import { Textarea } from "@/components/ui/textarea"
import { submitScholarship } from "@/app/actions/submit-scholarship"

interface ScholarshipButtonProps {
  text?: string
  variant?: "primary" | "outlined" | "default"
  className?: string
  asChild?: boolean
  children?: React.ReactNode
}

export function ScholarshipButton({
  text = "GET SCHOLARSHIP",
  variant = "default",
  className = "",
  asChild = false,
  children
}: ScholarshipButtonProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    setUserEmail(email)

    const result = await submitScholarship({
      name: formData.get("name") as string,
      email,
      university: formData.get("university") as string,
      reason: formData.get("reason") as string,
    })

    setIsSubmitting(false)

    if (result.success) {
      setSubmitSuccess(true)
    } else {
      alert(result.error || "Failed to submit scholarship request. Please try again.")
    }
  }

  const buttonClasses =
    variant === "primary"
      ? `w-full md:w-fit text-white rounded-full px-8 py-6 font-ibm-plex-mono uppercase text-sm md:text-base tracking-wide ${className}`
      : variant === "outlined"
      ? `w-full md:w-fit bg-transparent hover:text-black border border-dark rounded-full px-8 py-6 font-ibm-plex-mono uppercase text-sm md:text-base tracking-wide ${className}`
      : className

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClasses}>{children || text}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-anton uppercase">Request Free Access</DialogTitle>
          <DialogDescription className="font-helvetica">
            Students can participate in Traction 13 for free. Fill out this form and we'll review your request.
          </DialogDescription>
        </DialogHeader>

        {submitSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="text-6xl">✓</div>
            <h3 className="text-xl font-anton uppercase">Request Submitted!</h3>
            <p className="font-helvetica text-muted-foreground">
              Thank you for your interest! We've received your scholarship request and will review it shortly.
              You'll hear back from us at <span className="font-helvetica-bold">{userEmail}</span>.
            </p>
            <Button
              onClick={() => {
                setOpen(false)
                setSubmitSuccess(false)
              }}
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-3 font-ibm-plex-mono uppercase text-sm tracking-wide"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-helvetica-bold">
                Full Name *
              </label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-helvetica-bold">
                Email *
              </label>
              <Input id="email" name="email" type="email" placeholder="your@email.com" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="university" className="text-sm font-helvetica-bold">
                University / Institution *
              </label>
              <Input
                id="university"
                name="university"
                placeholder="e.g., Seoul National University"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-helvetica-bold">
                Why do you want to participate in Traction 13? *
              </label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Tell us about your motivation and what you hope to achieve..."
                className="min-h-[100px] font-helvetica border border-gray-400"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-6 font-ibm-plex-mono uppercase tracking-wide disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
