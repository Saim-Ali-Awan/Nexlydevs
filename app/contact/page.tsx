'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useForm, ValidationError } from '@formspree/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { ArrowRight, Loader2, MessageSquare, Zap, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const [state, handleSubmit] = useForm('mgakbvbw')
  const [showSuccessView, setShowSuccessView] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

 
  useEffect(() => {
    if (state.succeeded) {
      toast.add({
        type: 'success',
        title: 'Message sent successfully!',
        description: "We'll get back to you within 24 hours.",
      })
      setShowSuccessView(true)
      if (formRef.current) formRef.current.reset()
    }
  }, [state.succeeded])

  useEffect(() => {
    if (state.errors) {
      const errorKeys = Object.keys(state.errors)
      if (errorKeys.length > 0) {
        const firstErrorKey = errorKeys[0] as keyof typeof state.errors
        const errorValue = state.errors[firstErrorKey]
        
        // Formspree errors can be strings or objects
        const errorMessage = typeof errorValue === 'string' 
          ? errorValue 
          : (errorValue as any)?.message || 'Please check your fields and try again.'

        toast.add({
          type: 'error',
          title: 'Submission failed',
          description: errorMessage,
        })
        console.error('Formspree Error:', state.errors)
      }
    }
  }, [state.errors])

  if (state.succeeded && showSuccessView) {
    return (
      <div className="container mx-auto px-6 py-32 mt-16 md:mt-20 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-primary/10 p-6 rounded-full mb-8"
        >
          <MessageSquare className="h-12 w-12 text-primary" />
        </motion.div>
        <h1 className="text-4xl font-medium tracking-tight mb-4">Message received.</h1>
        <p className="text-muted-foreground text-lg mb-8">We'll get back to you within 24 hours.</p>
        <Button 
          onClick={() => setShowSuccessView(false)} 
          variant="outline" 
          className="rounded-full"
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 sm:px-10 lg:px-14 py-24 sm:py-32 mt-16 md:mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left Side: Text & Tagline */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight mb-6">
            Start building your <br /> next big SaaS today.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md mb-8">
            Whether you need a full SaaS platform, a sleek marketing site, or an Android app, we're ready to dive in.
          </p>

          <div className="space-y-4 text-sm border-t border-border/60 pt-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Have a feature request for an existing product?</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Need to file a complaint or report a bug?</span>
            </div>
            <p className="text-xs text-muted-foreground/60 pt-2">
              Use the form to let us know. We take every request seriously.
            </p>
          </div>
        </motion.div>

        {/* Right Side: Formspree Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm"
        >
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required className="bg-background" />
                <ValidationError prefix="Name" field="name" errors={state.errors} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required className="bg-background" />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Project Details</Label>
              <textarea 
                id="message" 
                name="message"
                rows={5}
                placeholder="Tell us about what you're building or the issue you're facing..."
                required
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} />
            </div>

            <Button 
              type="submit" 
              disabled={state.submitting} 
              className="w-full h-12 rounded-full cursor-pointer"
            >
              {state.submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}