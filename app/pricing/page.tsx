"use client"

import * as React from "react"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowUpRight,
  ArrowDown,
  Check,
  Minus,
} from "lucide-react"
import { Navbar } from "@/components/sections/navbar"

gsap.registerPlugin(ScrollTrigger)

/* ---------------- Types ---------------- */

type Billing = "monthly" | "annual"

/* ---------------- Data ---------------- */

const PLANS = [
  {
    number: "01",
    name: "Starter",
    tagline: "For solo operators getting paid faster.",
    monthly: 19,
    annual: 190,
    featured: false,
    features: [
      "1 payment connection",
      "Reads existing invoices",
      "Real-time payment sync",
      "Scheduled email reminders",
      "Open tracking",
      "1 seat included",
    ],
  },
  {
    number: "02",
    name: "Growth",
    tagline: "For teams chasing real volume.",
    monthly: 29,
    annual: 290,
    featured: true,
    features: [
      "3 payment connections",
      "Everything in Starter",
      "Auto-matched replies",
      "Follow-up suggestions",
      "12-month client history",
      "3 seats included",
    ],
  },
  {
    number: "03",
    name: "Scale",
    tagline: "For the head of payments who decides.",
    monthly: 39,
    annual: 390,
    featured: false,
    features: [
      "Unlimited connections",
      "Everything in Growth",
      "Custom metrics",
      "Personalised dashboard layout",
      "Branded to your business",
      "10 seats · priority support",
    ],
  },
]

const COMPARE: {
  group: string
  rows: {
    label: string
    values: [boolean | string, boolean | string, boolean | string]
  }[]
}[] = [
  {
    group: "Connect",
    rows: [
      { label: "Payment connections", values: ["1", "3", "Unlimited"] },
      { label: "Reads existing invoices", values: [true, true, true] },
      { label: "Real-time payment sync", values: [true, true, true] },
      { label: "Zero data re-entry", values: [true, true, true] },
    ],
  },
  {
    group: "Track",
    rows: [
      { label: "Scheduled reminders", values: [true, true, true] },
      { label: "Custom reminder templates", values: [false, true, true] },
      { label: "Open tracking", values: [true, true, true] },
      { label: "Client history", values: ["30 days", "12 months", "Unlimited"] },
    ],
  },
  {
    group: "Respond",
    rows: [
      { label: "Auto-matched replies", values: [true, true, true] },
      { label: "Reply snippets", values: [false, true, true] },
      { label: "Follow-up suggestions", values: [false, true, true] },
    ],
  },
  {
    group: "Decide",
    rows: [
      { label: "Outstanding balance dashboard", values: [true, true, true] },
      { label: "Cash expected this week", values: [true, true, true] },
      { label: "Custom metrics", values: [false, false, true] },
      { label: "Personalised layout", values: [false, false, true] },
      { label: "Branded to your business", values: [false, false, true] },
    ],
  },
]

const FAQS = [
  {
    q: "Do I have to migrate my payments?",
    a: "No. Duely reads your existing invoices and payments directly. No new ledger to maintain, no data re-entry, nothing to move.",
  },
  {
    q: "What happens after I subscribe?",
    a: "You connect your payment system, Duely reads open invoices on its own, and your first reminders go out from there.",
  },
  {
    q: "Can I switch plans?",
    a: "Any time. Upgrades apply immediately and are prorated; downgrades apply at the next billing cycle.",
  },
  {
    q: "What if Duely does not fit?",
    a: "Cancel whenever it stops being useful. No lock-in, no exit fees, and your data stays yours.",
  },
  {
    q: "Annual or monthly?",
    a: "Annual gives you two months free. Monthly keeps you flexible. Every feature of your plan is the same either way.",
  },
]

const MARQUEE_ITEMS = [
  "duely",
  "pricing",
  "$19",
  "$29",
  "$39",
  "no migration",
  "no per-invoice fees",
  "cancel anytime",
  "get paid",
  "on time",
]

/* Point these at /contact, or swap in your Stripe payment links
   per plan when checkout is ready. */
const PLAN_CTA_HREF = "/contact"
const FINAL_CTA_HREF = "/contact"

/* ---------------- Page ---------------- */

export default function PricingPage() {
  const [loaderDone, setLoaderDone] = React.useState(false)
  const [billing, setBilling] = React.useState<Billing>("monthly")

  React.useEffect(() => {
    if (!document.documentElement.classList.contains("is-loading")) {
      setLoaderDone(true)
      return
    }
    const handler = () => setLoaderDone(true)
    window.addEventListener("nexly:loader-exit", handler)
    return () => window.removeEventListener("nexly:loader-exit", handler)
  }, [])

  React.useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined
    if (nav?.type === "reload") {
      window.scrollTo(0, 0)
      if (window.location.hash)
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        )
    }
  }, [])

  return (
    <>
      <Navbar />
      <main id="main" className="relative pt-20 sm:pt-24">
        <Ambient />
        <MouseFollower />
        <PricingHero
          loaderDone={loaderDone}
          billing={billing}
          onBillingChange={setBilling}
        />
        <Plans billing={billing} />
        <Marquee />
        <CompareTable />
        <Faq />
        <ContactCta />
      </main>
    </>
  )
}

/* ---------------- Ambient / Cursor ---------------- */

function Ambient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <style>{`
        @keyframes nx-float-a { 0%,100%{transform:translate3d(-6%,-4%,0) scale(1)} 50%{transform:translate3d(6%,6%,0) scale(1.08)} }
        @keyframes nx-float-b { 0%,100%{transform:translate3d(4%,6%,0) scale(1)} 50%{transform:translate3d(-6%,-4%,0) scale(1.06)} }
      `}</style>
      <div
        className="absolute top-0 left-1/2 h-[80vh] w-[120vw] -translate-x-1/2 opacity-100 dark:opacity-40"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 0%, color-mix(in oklch, var(--primary) 12%, transparent) 0%, transparent 70%)",
          animation: "nx-float-a 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-[60vh] w-[100vw] -translate-x-1/2 opacity-100 dark:opacity-30"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 100%, color-mix(in oklch, var(--primary) 9%, transparent) 0%, transparent 70%)",
          animation: "nx-float-b 26s ease-in-out infinite",
        }}
      />
    </div>
  )
}

function MouseFollower() {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  useGSAP(() => {
    if (reduce || !ref.current) return
    const xTo = gsap.quickTo(ref.current, "x", {
      duration: 1.2,
      ease: "power3.out",
    })
    const yTo = gsap.quickTo(ref.current, "y", {
      duration: 1.2,
      ease: "power3.out",
    })
    const onMove = (e: MouseEvent) => {
      xTo(e.clientX - 220)
      yTo(e.clientY - 220)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [reduce])
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-0 h-[440px] w-[440px] opacity-[0.20] dark:opacity-[0.12]"
      style={{
        background:
          "radial-gradient(circle, color-mix(in oklch, var(--primary) 60%, transparent) 0%, transparent 60%)",
        filter: "blur(70px)",
      }}
    />
  )
}

/* ---------------- Text primitives ---------------- */

function SplitWords({
  text,
  className = "",
  as: Tag = "span",
  stagger = 0.07,
  duration = 1.1,
  play,
  reverse = true,
}: {
  text: string
  className?: string
  as?: "span" | "h1" | "h2" | "h3"
  stagger?: number
  duration?: number
  play?: boolean
  reverse?: boolean
}) {
  const ref = React.useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const words = ref.current?.querySelectorAll<HTMLElement>(".split-word")
      if (!words?.length) return
      if (play === undefined) {
        gsap.fromTo(
          words,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration,
            stagger,
            ease: "power4.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 88%",
              toggleActions: reverse
                ? "play none none reverse"
                : "play none none none",
            },
          }
        )
        return
      }
      if (play === false) {
        gsap.set(words, { yPercent: 110 })
        return
      }
      gsap.set(words, { yPercent: 110 })
      gsap.to(words, { yPercent: 0, duration, stagger, ease: "power4.out" })
    },
    { scope: ref, dependencies: [play], revertOnUpdate: false }
  )

  return (
    <Tag ref={ref as never} className={`inline-flex flex-wrap ${className}`}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="mr-[0.25em] inline-block overflow-hidden pb-[0.05em] align-bottom"
        >
          <span className="split-word inline-block">{word}</span>
        </span>
      ))}
    </Tag>
  )
}

function SplitChars({
  text,
  className = "",
  stagger = 0.02,
  play,
}: {
  text: string
  className?: string
  stagger?: number
  play?: boolean
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  useGSAP(
    () => {
      const chars = ref.current?.querySelectorAll<HTMLElement>(".split-char")
      if (!chars?.length) return
      if (play === false) {
        gsap.set(chars, { yPercent: 110 })
        return
      }
      gsap.set(chars, { yPercent: 110 })
      gsap.to(chars, {
        yPercent: 0,
        duration: 0.8,
        stagger,
        ease: "power4.out",
      })
    },
    { scope: ref, dependencies: [play], revertOnUpdate: false }
  )
  return (
    <span ref={ref} className={className}>
      {text.split("").map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span className="split-char inline-block">
            {ch === " " ? "\u00A0" : ch}
          </span>
        </span>
      ))}
    </span>
  )
}

function MagneticCTA({
  href,
  inverted = false,
  children,
}: {
  href: string
  inverted?: boolean
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLAnchorElement>(null)
  const reduce = useReducedMotion()
  useGSAP(() => {
    if (reduce || !ref.current) return
    const el = ref.current
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" })
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" })
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - r.left - r.width / 2) * 0.3)
      yTo((e.clientY - r.top - r.height / 2) * 0.3)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener("mousemove", move)
    el.addEventListener("mouseleave", leave)
    return () => {
      el.removeEventListener("mousemove", move)
      el.removeEventListener("mouseleave", leave)
    }
  }, [reduce])
  return (
    <Link
      ref={ref}
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium ${
        inverted
          ? "bg-background text-foreground"
          : "bg-foreground text-background"
      }`}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}

function SectionLabel({
  index,
  trailing,
  children,
}: {
  index: string
  trailing?: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (!ref.current) return
      gsap.from(ref.current, {
        opacity: 0,
        y: 8,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 92%",
          toggleActions: "play none none reverse",
        },
      })
    },
    { scope: ref }
  )
  return (
    <div
      ref={ref}
      className="flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase"
    >
      <div>
        <span>{index}</span>
        <span className="mx-2 opacity-60">/</span>
        <span>{children}</span>
      </div>
      {trailing && <span className="opacity-60">{trailing}</span>}
    </div>
  )
}

/* ---------------- Billing toggle ---------------- */

function BillingToggle({
  billing,
  onChange,
}: {
  billing: Billing
  onChange: (b: Billing) => void
}) {
  return (
    <div
      role="group"
      aria-label="Billing period"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1"
    >
      {(["monthly", "annual"] as Billing[]).map((b) => {
        const active = billing === b
        return (
          <button
            key={b}
            type="button"
            onClick={() => onChange(b)}
            aria-pressed={active}
            className={`min-h-[44px] rounded-full px-6 py-2.5 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {b === "monthly" ? "Monthly" : "Annual · 2 months free"}
          </button>
        )
      })}
    </div>
  )
}

/* ---------------- Hero ---------------- */

function PricingHero({
  loaderDone,
  billing,
  onBillingChange,
}: {
  loaderDone: boolean
  billing: Billing
  onBillingChange: (b: Billing) => void
}) {
  const ref = React.useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.set(".hero-sub", { opacity: 0, y: 24 })
      gsap.set(".hero-toggle", { opacity: 0, y: 16 })
      gsap.set(".hero-live", { opacity: 0, y: 12 })
      gsap.set(".hero-scroll", { opacity: 0, y: 12 })
    },
    { scope: ref }
  )

  useGSAP(
    () => {
      if (!loaderDone) return
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
      tl.to(".hero-sub", { opacity: 1, y: 0, duration: 0.9 }, 0.1)
      tl.to(".hero-toggle", { opacity: 1, y: 0, duration: 0.7 }, 0.35)
      tl.to(".hero-live", { opacity: 1, y: 0, duration: 0.6 }, 0.55)
      tl.to(".hero-scroll", { opacity: 1, y: 0, duration: 0.6 }, 0.7)
    },
    { scope: ref, dependencies: [loaderDone] }
  )

  return (
    <section
      ref={ref}
      className="relative mx-auto max-w-[1600px] px-6 pt-24 pb-32 sm:px-10 sm:pt-32 sm:pb-40 lg:px-14"
    >
      <p className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
        <SplitChars text="Duely pricing" play={loaderDone} stagger={0.02} />
      </p>

      <h1 className="mt-10 max-w-[16ch] text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.88] font-normal tracking-tighter">
        <SplitWords
          as="span"
          text="One product. Three prices."
          stagger={0.08}
          play={loaderDone}
          className="block"
        />
      </h1>

      <p className="hero-sub mt-16 max-w-xl text-lg leading-relaxed sm:text-xl">
        Duely starts at $19 a month. Every plan reads your existing invoices,
        tracks every reminder to the open, and gives the head of payments one
        clean dashboard. No migration, no per-invoice fees.
      </p>

      <div className="hero-toggle mt-10">
        <BillingToggle billing={billing} onChange={onBillingChange} />
      </div>

      <div className="hero-live mt-12 flex items-center gap-2.5">
        <span className="inline-flex h-2 w-2 rounded-full bg-foreground" />
        <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
          Prices in USD · cancel anytime
        </span>
      </div>

      <div className="hero-scroll mt-16 flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
          Scroll
        </span>
        <div className="relative h-8 w-[1px] overflow-hidden bg-border">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-x-0 h-4 bg-foreground"
          />
        </div>
        <ArrowDown
          className="h-3.5 w-3.5 text-muted-foreground"
          strokeWidth={1.5}
        />
      </div>
    </section>
  )
}

/* ---------------- Plans ---------------- */

function Plans({ billing }: { billing: Billing }) {
  const ref = React.useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.from(".plan-card", {
        opacity: 0,
        y: 60,
        rotateX: -10,
        filter: "blur(10px)",
        transformOrigin: "center top",
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      })
    },
    { scope: ref }
  )

  return (
    <section
      ref={ref}
      id="plans"
      className="mx-auto max-w-[1600px] scroll-mt-20 px-6 pb-40 sm:px-10 sm:pb-56 lg:px-14"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((p) => (
          <PlanCard key={p.name} plan={p} billing={billing} />
        ))}
      </div>
      <p className="mt-10 text-center font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
        All plans read your existing invoices · no migration · no per-invoice
        fees
      </p>
    </section>
  )
}

function PlanCard({
  plan: p,
  billing,
}: {
  plan: (typeof PLANS)[number]
  billing: Billing
}) {
  const price = billing === "monthly" ? p.monthly : p.annual
  const save = p.monthly * 12 - p.annual
  const tone = p.featured ? "text-background/70" : "text-muted-foreground"

  return (
    <article
      className={`plan-card relative flex flex-col rounded-2xl border p-8 sm:p-10 ${
        p.featured
          ? "border-foreground bg-foreground text-background shadow-[0_25px_60px_-30px_rgba(0,0,0,0.35)] dark:shadow-[0_30px_80px_-25px_rgba(0,0,0,0.7)]"
          : "border-border bg-card"
      }`}
    >
      <div
        className={`flex items-center justify-between font-mono text-[11px] tracking-[0.25em] uppercase ${tone}`}
      >
        <span>{p.number}</span>
        {p.featured && (
          <span className="rounded-full border border-background/25 px-3 py-1 text-[10px] tracking-[0.2em]">
            Most picked
          </span>
        )}
      </div>

      <h3 className="mt-6 text-3xl font-medium tracking-tight">{p.name}</h3>
      <p className={`mt-3 text-sm leading-relaxed ${tone}`}>{p.tagline}</p>

      <div className="mt-8 flex items-end gap-2">
        <span className="text-[clamp(3.25rem,4.5vw,4.25rem)] leading-none font-normal tracking-tighter tabular-nums">
          <motion.span
            key={`${p.name}-${billing}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="inline-block"
          >
            ${price}
          </motion.span>
        </span>
        <span className={`pb-1 font-mono text-[11px] ${tone}`}>
          / {billing === "monthly" ? "month" : "year"}
        </span>
      </div>

      <p className={`mt-2 font-mono text-[10px] tracking-wider ${tone}`}>
        {billing === "monthly"
          ? "billed monthly · cancel anytime"
          : `billed yearly · save $${save} — two months free`}
      </p>

      <ul className={`mt-8 space-y-2.5 ${tone}`}>
        {p.features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2.5 font-mono text-xs"
          >
            <span className="h-1 w-1 rounded-full bg-current opacity-60" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex pt-10">
        {p.featured ? (
          <MagneticCTA href={PLAN_CTA_HREF} inverted>
            Start with {p.name}
          </MagneticCTA>
        ) : (
          <Link
            href={PLAN_CTA_HREF}
            className="inline-flex h-11 items-center rounded-full border border-border px-7 text-sm font-medium transition-colors hover:bg-foreground/5"
          >
            Start with {p.name}
          </Link>
        )}
      </div>
    </article>
  )
}

/* ---------------- Marquee ---------------- */

function Marquee() {
  const ref = React.useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const track =
        ref.current?.querySelector<HTMLDivElement>(".nx-marquee-track")
      if (!track) return
      const tl = gsap.to(track, {
        xPercent: -50,
        duration: 32,
        ease: "none",
        repeat: -1,
      })
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          const v = Math.min(Math.abs(self.getVelocity()) / 400, 5)
          tl.timeScale(1 + v)
          gsap.to(tl, {
            timeScale: 1,
            duration: 1.2,
            ease: "power2.out",
            overwrite: true,
          })
        },
      })
    },
    { scope: ref }
  )

  return (
    <div
      ref={ref}
      className="relative overflow-hidden border-y border-foreground bg-foreground py-6"
      aria-hidden
    >
      <div className="nx-marquee-track flex w-[200%] will-change-transform">
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 items-center">
            {MARQUEE_ITEMS.map((t, i) => (
              <span
                key={`${group}-${i}`}
                className="inline-flex items-center px-6 text-3xl font-normal tracking-tight whitespace-nowrap text-background sm:text-4xl"
              >
                {t}
                <span className="ml-6 inline-block h-1 w-1 rounded-full bg-background/40" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Compare ---------------- */

function CompareTable() {
  const ref = React.useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.from(".compare-head", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
      gsap.from(".compare-group", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      })
    },
    { scope: ref }
  )

  return (
    <section
      ref={ref}
      id="compare"
      className="mx-auto max-w-[1600px] scroll-mt-20 px-6 py-40 sm:px-10 sm:py-56 lg:px-14"
    >
      <div className="compare-head mb-16">
        <SectionLabel index="00" trailing="04 groups">
          Compare
        </SectionLabel>
        <h2 className="mt-10 text-[clamp(3rem,7vw,6rem)] leading-[0.92] font-normal tracking-tighter">
          <SplitWords text="What's inside." stagger={0.08} />
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Four jobs: connect, track, respond, decide. Every plan does all four.
          The difference is depth, not access.
        </p>
      </div>

      <div className="overflow-x-auto [scrollbar-width:thin]">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="w-[40%] py-4 pr-6 font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
                Feature
              </th>
              {PLANS.map((p) => (
                <th
                  key={p.name}
                  className={`py-4 px-4 text-center ${
                    p.featured ? "bg-muted/40" : ""
                  }`}
                >
                  <span className="block text-sm font-medium tracking-tight">
                    {p.name}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] text-muted-foreground tabular-nums">
                    ${p.monthly} / mo
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((group) => (
              <React.Fragment key={group.group}>
                <tr className="compare-group">
                  <th
                    colSpan={4}
                    className="pt-12 pb-3 text-left font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase"
                  >
                    {group.group}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <td className="py-4 pr-6 text-sm font-medium">
                      {row.label}
                    </td>
                    {row.values.map((v, i) => (
                      <td
                        key={i}
                        className={`py-4 px-4 text-center ${
                          i === 1 ? "bg-muted/40" : ""
                        }`}
                      >
                        {v === true ? (
                          <Check
                            className="mx-auto h-4 w-4"
                            strokeWidth={2}
                          />
                        ) : v === false ? (
                          <Minus
                            className="mx-auto h-4 w-4 text-muted-foreground/50"
                            strokeWidth={1.5}
                          />
                        ) : (
                          <span className="font-mono text-xs tabular-nums">
                            {v}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/* ---------------- FAQ ---------------- */

function Faq() {
  const ref = React.useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.from(".faq-row", {
        opacity: 0,
        x: -40,
        filter: "blur(6px)",
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      })
    },
    { scope: ref }
  )

  return (
    <section
      ref={ref}
      id="faq"
      className="mx-auto max-w-[1600px] scroll-mt-20 px-6 py-40 sm:px-10 sm:py-56 lg:px-14"
    >
      <div className="grid gap-20 lg:grid-cols-[1fr_2fr] lg:gap-28">
        <div>
          <SectionLabel index="01" trailing="05 answers">
            FAQ
          </SectionLabel>
          <h2 className="mt-10 text-[clamp(3rem,7vw,6rem)] leading-[0.92] font-normal tracking-tighter">
            <SplitWords text="Before you pay." stagger={0.08} />
          </h2>
        </div>
        <div className="space-y-14">
          {FAQS.map((f, i) => (
            <div
              key={f.q}
              className="faq-row grid gap-6 sm:grid-cols-[4rem_1fr]"
            >
              <div className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="text-xl font-medium tracking-tight">{f.q}</h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Final CTA ---------------- */

function ContactCta() {
  const ref = React.useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.from(".cta-line", {
        yPercent: 110,
        duration: 1.15,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
      gsap.from(".cta-actions", {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      })
    },
    { scope: ref }
  )

  return (
    <section
      ref={ref}
      id="start"
      className="relative mx-auto max-w-[1600px] scroll-mt-20 px-6 py-40 sm:px-10 sm:py-56 lg:px-14"
    >
      <SectionLabel index="02" trailing="Open for 2026">
        Contact
      </SectionLabel>
      <h2 className="mt-10 max-w-6xl text-[clamp(3rem,8vw,8rem)] leading-[0.9] font-normal tracking-tighter">
        <span className="block overflow-hidden">
          <span className="cta-line block">Stop chasing.</span>
        </span>
        <span className="block overflow-hidden">
          <span className="cta-line block">Start collecting.</span>
        </span>
      </h2>
      <p className="mt-16 max-w-md text-base leading-relaxed text-muted-foreground">
        Plans start at $19 a month. If Duely pays for itself, it stays. If not,
        you cancel. Either way, you keep the dashboard.
      </p>
      <div className="cta-actions mt-16 flex flex-wrap items-center gap-4">
        <MagneticCTA href={FINAL_CTA_HREF}>Start with Duely</MagneticCTA>
      </div>
    </section>
  )
}