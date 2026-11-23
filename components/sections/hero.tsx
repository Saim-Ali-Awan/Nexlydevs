'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Sparkles, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGsap } from '@/hooks/use-gsap'

export function Hero() {
  const reduce = useReducedMotion()
  const bgRef = React.useRef<HTMLDivElement>(null)
  const orbARef = React.useRef<HTMLDivElement>(null)
  const orbBRef = React.useRef<HTMLDivElement>(null)

  useGsap(
    ({ gsap }) => {
      if (!orbARef.current || !orbBRef.current) return
      gsap.to(orbARef.current, {
        yPercent: -30, ease: 'none',
        scrollTrigger: { trigger: bgRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })
      gsap.to(orbBRef.current, {
        yPercent: 40, ease: 'none',
        scrollTrigger: { trigger: bgRef.current, start: 'top top', end: 'bottom top', scrub: 0.8 },
      })
    },
    bgRef
  )

  return (
    <section id="top" ref={bgRef} aria-label="Hero" className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div
          ref={orbARef}
          className="absolute -top-32 -left-24 h-[460px] w-[460px] rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 60%, transparent), transparent 60%)' }}
        />
        <div
          ref={orbBRef}
          className="absolute top-1/2 -right-32 h-[520px] w-[520px] rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 50%, transparent), transparent 60%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-12 text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <Badge variant="outline" className="gap-1.5 rounded-full border-border bg-card/60 backdrop-blur px-3 py-1 text-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-muted-foreground">Now building · Duely is in private beta</span>
          </Badge>
        </motion.div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-balance text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]"
        >
          Focused SaaS tools.
          <br />
          <span className="text-muted-foreground">Built by a micro team that ships.</span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          Nexly builds small, opinionated SaaS products for small teams. Our flagship,{' '}
          <span className="font-medium text-foreground">Duely</span>, sends automatic payment-reminder emails to your clients — so invoices get paid on time, without the awkward follow-up.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="rounded-full">
            <Link href="#waitlist">
              <Sparkles className="mr-1.5 h-4 w-4" aria-hidden />
              Join the waitlist
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full bg-card/40 backdrop-blur">
            <Link href="#how">
              <Play className="mr-1.5 h-4 w-4" aria-hidden />
              See how it works
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
        >
          <span className="font-mono">Works with</span>
          <span className="opacity-80">Gmail</span>
          <span className="opacity-30">·</span>
          <span className="opacity-80">Outlook</span>
          <span className="opacity-30">·</span>
          <span className="opacity-80">Stripe (soon)</span>
          <span className="opacity-30">·</span>
          <span className="opacity-80">CSV import</span>
        </motion.div>
      </div>
    </section>
  )
}