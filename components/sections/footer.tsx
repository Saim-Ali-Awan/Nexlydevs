'use client'

import * as React from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Studio', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com', external: true },
  { label: 'X', href: 'https://x.com', external: true },
] as const

export function Footer() {
  const ref = React.useRef<HTMLElement>(null)
  const wordRef = React.useRef<HTMLHeadingElement>(null)
  const year = new Date().getFullYear()

  useGSAP(() => {
    if (!wordRef.current) return
    gsap.from(wordRef.current, {
      yPercent: 105, duration: 1.4, ease: 'power4.out',
      scrollTrigger: { trigger: wordRef.current, start: 'top 92%', toggleActions: 'play none none reverse' },
    })
  }, { scope: ref })

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-border">
      <div className="mx-auto max-w-[1600px] px-6 pt-24 sm:px-10 sm:pt-32 lg:px-14 lg:pt-40">
        <div className="overflow-hidden">
          <h2 ref={wordRef} className="select-none text-[clamp(4rem,20vw,20rem)] font-normal lowercase leading-[0.8] tracking-tighter">
            nexlydevs
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 py-20 sm:px-10 sm:py-24 lg:px-14">
        <div className="flex flex-col gap-12 sm:flex-row sm:items-end sm:justify-between">
          <ul className="flex flex-wrap gap-x-10 gap-y-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group relative inline-block transition-colors hover:text-foreground">
                  {l.label}
                  <span aria-hidden className="pointer-events-none absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>

          <ul className="flex flex-wrap gap-x-10 gap-y-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            {SOCIAL.map((l) => (
              <li key={l.href}>
                <a href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener noreferrer' : undefined} className="group relative inline-block transition-colors hover:text-foreground">
                  {l.label}
                  <span aria-hidden className="pointer-events-none absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span>© {year} NexlyDevs</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  )
}