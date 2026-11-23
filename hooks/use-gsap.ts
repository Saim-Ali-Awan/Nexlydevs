'use client'

import * as React from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function useGsap(
  effect: (ctx: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }) => void,
  scope: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList = []
) {
  const reduce = useReducedMotion()

  React.useLayoutEffect(() => {
    if (reduce) return
    if (!scope.current) return

    const el = scope.current
    const ctx = gsap.context(() => {
      effect({ gsap, ScrollTrigger })
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, ...deps])
}

export function useParallaxY(
  ref: React.RefObject<HTMLElement | null>,
  opts: { from?: number; to?: number; start?: string; end?: string } = {}
) {
  const { from = 0, to = -80, start = 'top bottom', end = 'bottom top' } = opts
  useGsap(
    ({ gsap }) => {
      gsap.fromTo(
        ref.current,
        { y: from },
        {
          y: to,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start, end, scrub: 0.5 },
        }
      )
    },
    ref
  )
}