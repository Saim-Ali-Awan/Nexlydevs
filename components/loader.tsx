'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const
const EXIT_EASE = [0.76, 0, 0.24, 1] as const

const T_HOLD = 250
const T_WORDMARK = 1.0
const T_CONTENT_OUT = 0.45
const T_PANEL_OUT = 0.85
const T_BEAT = 100

export function Loader() {
  const reduce = useReducedMotion()
  const [progress, setProgress] = React.useState(0)
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    if (done) return

    const nav = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined
    const realLoadTime =
      nav && nav.loadEventEnd > 0 ? nav.loadEventEnd - nav.startTime : 0
    const DURATION = Math.min(5000, Math.max(1400, realLoadTime * 1.1))

    const start = performance.now()
    let raf = 0
    let stopped = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let alreadyLoaded = document.readyState === 'complete'
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = () => {
      if (stopped) return
      if (!alreadyLoaded && document.readyState === 'complete') alreadyLoaded = true

      const elapsed = performance.now() - start
      let pct: number
      if (alreadyLoaded) {
        pct = easeOutCubic(Math.min(1, elapsed / DURATION)) * 100
      } else {
        pct = easeOutCubic(Math.min(1, elapsed / 10000)) * 85
        if (document.readyState === 'interactive') pct = Math.max(pct, 40)
      }

      const rounded = Math.min(100, Math.floor(pct))
      setProgress((prev) => (prev !== rounded ? rounded : prev))
      if (rounded >= 100) {
        timeoutId = setTimeout(() => setDone(true), T_HOLD)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [done])

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.classList.remove('is-loading')
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('nexly:loader-exit'))
        }, T_BEAT)
      }}
    >
      {!done && (
        <motion.div
          key="loader"
          initial={{ y: 0 }}
          exit={{
            y: '100%',
            transition: {
              duration: T_PANEL_OUT,
              delay: T_CONTENT_OUT * 0.6,
              ease: EXIT_EASE,
            },
          }}
          className="fixed inset-0 z-[100] overflow-hidden bg-background text-foreground"
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            exit={{
              scale: reduce ? 1 : 1.06,
              opacity: 0,
              transition: { duration: T_CONTENT_OUT, ease: EXIT_EASE },
            }}
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: T_WORDMARK, ease: EASE }}
              className="select-none text-[clamp(3rem,11vw,10rem)] font-medium lowercase leading-none tracking-tighter"
            >
              nexlydevs
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute left-6 top-6 sm:left-14 sm:top-10"
            exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
          >
            <span className="font-mono text-sm font-medium tabular-nums tracking-tight text-muted-foreground">
              {progress < 100 ? 'Loading' : 'Almost there'} — {progress}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}