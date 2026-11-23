'use client'

import * as React from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

export default function NotFound() {
  const ref = React.useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  useGSAP(() => {
    if (reduce) return
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.from('.err-eyebrow', { opacity: 0, y: 12, duration: 0.6 })
    tl.from(
      '.err-digit',
      {
        yPercent: 110,
        opacity: 0,
        rotateX: -80,
        transformPerspective: 900,
        transformOrigin: 'center top',
        stagger: 0.12,
        duration: 1.1,
      },
      '-=0.3'
    )
    tl.from('.err-message', { opacity: 0, y: 16, duration: 0.7 }, '-=0.5')
    tl.from('.err-cta > *', { opacity: 0, y: 12, stagger: 0.08, duration: 0.6 }, '-=0.4')
    tl.from('.err-footer', { opacity: 0, duration: 0.6 }, '-=0.3')

    gsap.to('.err-digit', {
      yPercent: -4,
      duration: 3.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: { each: 0.4, from: 'start' },
    })

    gsap.to('.err-glow', {
      scale: 1.15,
      opacity: 0.8,
      duration: 5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  }, { scope: ref })

  return (
    <main
      ref={ref}
      className="relative min-h-[calc(100svh-5rem)] flex items-center justify-center overflow-hidden px-6 py-32"
    >
      <div
        aria-hidden
        className="err-glow pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 55% at 50% 45%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 65%)',
          opacity: 0.6,
        }}
      />

      <div className="relative max-w-3xl text-center">
        <p className="err-eyebrow font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Error / 404
        </p>

        <h1 className="mt-10 flex items-center justify-center text-[clamp(6rem,18vw,14rem)] font-normal leading-[0.85] tracking-tighter">
          {['4', '0', '4'].map((digit, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom px-[0.02em]">
              <span className="err-digit inline-block">{digit}</span>
            </span>
          ))}
        </h1>

        <p className="err-message mx-auto mt-10 max-w-md text-base leading-relaxed text-muted-foreground">
          The page you are looking for does not exist.
        </p>

        <div className="err-cta mt-14 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background"
          >
            Back to home
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-foreground/5"
          >
            Report a broken link
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
          className="err-footer mt-24 flex items-center justify-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />
          </span>
          <span>NexlyDevs</span>
        </motion.div>
      </div>
    </main>
  )
}