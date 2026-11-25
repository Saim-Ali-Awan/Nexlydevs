'use client'

import * as React from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EASE = [0.16, 1, 0.3, 1] as const
const SLIDE_EASE = [0.76, 0, 0.24, 1] as const
const WIPE_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'

const NAV_ITEMS = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Studio', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
] as const

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'X', href: 'https://x.com' },
] as const

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => {
    ready: Promise<void>
    finished: Promise<void>
    updateCallbackDone: Promise<void>
  }
}

export function Navbar() {
  const [open, setOpen] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const reduce = useReducedMotion()

  React.useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      try { if (localStorage.getItem('theme')) return } catch {}
      setIsDark(e.matches)
      document.documentElement.classList.toggle('dark', e.matches)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = () => {
    const next = !isDark

    const apply = () => {
      setIsDark(next)
      document.documentElement.classList.toggle('dark', next)
      try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch {}
    }

    const doc = document as ViewTransitionDocument

    // Fallback for unsupported browsers / reduced motion
    if (!doc.startViewTransition || reduce) {
      apply()
      return
    }

    const transition = doc.startViewTransition(apply)

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
          },
          {
            duration: 800,
            easing: WIPE_EASE,
            pseudoElement: '::view-transition-new(root)',
          }
        )
      })
      .catch(() => {
        // If the transition fails, the theme has already switched via apply()
      })
  }

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* View Transitions CSS — set once, applies to ::view-transition pseudo-elements */}
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
        ::view-transition-old(root) {
          z-index: 0;
        }
        ::view-transition-new(root) {
          z-index: 1;
        }
      `}</style>

      <header className="fixed top-0 inset-x-0 z-50 bg-background border-b border-border/60">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
          <nav
            aria-label="Primary"
            className="flex h-20 sm:h-24 items-center justify-between gap-4"
          >
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-2xl sm:text-3xl font-medium tracking-tight lowercase shrink-0"
            >
              nexlydevs
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              {mounted && (
                <Button
                  type="button"
                  onClick={toggleTheme}
                  variant="ghost"
                  size="icon"
                  aria-label={isDark ? 'Switch to light' : 'Switch to dark'}
                  className="h-11 w-11 rounded-full"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                      <motion.span
                        key="sun"
                        initial={reduce ? false : { rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <Sun className="h-4 w-4" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="moon"
                        initial={reduce ? false : { rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <Moon className="h-4 w-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              )}

              <div className="hidden lg:flex items-center gap-2">
                <Button asChild variant="ghost" className="rounded-full">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="rounded-full px-6">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                className="group h-11 w-11 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                <span className="relative flex h-3 w-5 flex-col justify-between">
                  <motion.span
                    animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
                    className="block h-[1px] w-full bg-current origin-center"
                  />
                  <motion.span
                    animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
                    className="block h-[1px] w-full bg-current origin-center"
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {open && <MenuOverlay onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { x: '100%' }}
      animate={reduce ? { opacity: 1 } : { x: 0 }}
      exit={reduce ? { opacity: 0 } : { x: '100%' }}
      transition={reduce ? { duration: 0.4, ease: EASE } : { duration: 0.9, ease: SLIDE_EASE }}
      className="fixed inset-0 z-40 overflow-y-auto bg-background"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto flex min-h-full max-w-[1600px] flex-col justify-between px-6 sm:px-10 lg:px-14 pb-10 pt-28">
        <ul className="flex flex-col">
          {NAV_ITEMS.map((item, i) => (
            <motion.li
              key={item.href}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.06, ease: EASE }}
              className="border-b border-border/60"
            >
              <Link href={item.href} onClick={onClose} className="group flex items-baseline gap-6 py-5">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-foreground/30 transition-colors duration-500 group-hover:text-foreground">
                  {item.label}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 group-hover:scale-x-100"
                  />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
          className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
        >
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
            A development studio building software for specific industries.
          </p>
          <ul className="flex gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="hover:text-foreground transition-colors">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  )
}