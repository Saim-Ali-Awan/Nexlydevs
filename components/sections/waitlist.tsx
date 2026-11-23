'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function Waitlist() {
  const reduce = useReducedMotion()
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'done'>('idle')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.')
      return
    }
    setStatus('loading')
    try {
      // Simulated API call — replace with your real endpoint
      await new Promise((r) => setTimeout(r, 900))
      setStatus('done')
      toast.success("You're on the list! We'll reach out soon.")
    } catch {
      setStatus('idle')
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <section
      id="waitlist"
      aria-labelledby="waitlist-heading"
      className="relative py-24 sm:py-32 border-t border-border overflow-hidden"
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 glow-cyan"
      />

      <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 sm:p-12 text-center"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/40 text-primary">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>

          <h2
            id="waitlist-heading"
            className="mt-5 text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
          >
            Get early access to Duely.
          </h2>

          <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Join 200+ founders, freelancers, and small agencies on the waitlist. We onboard 10 new users every week — and early sign-ups get 3 months of Pro for free.
          </p>

          {status === 'done' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-3 text-sm text-foreground mx-auto max-w-md"
            >
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden />
              <span>You&apos;re on the list. Check your inbox for a confirmation.</span>
            </motion.div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
            >
              <label htmlFor="waitlist-email" className="sr-only">
                Email address
              </label>
              <Input
                id="waitlist-email"
                type="email"
                placeholder="founder@yourstartup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                required
                className="h-11 rounded-full bg-background border-border flex-1 w-full"
              />
              <Button
                type="submit"
                size="lg"
                className="h-11 rounded-full w-full sm:w-auto"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
                {status !== 'loading' && <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />}
              </Button>
            </form>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            No spam. Just one email when your spot opens up.
          </p>
        </motion.div>
      </div>
    </section>
  )
}