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
  Mail,
  MailOpen,
  CheckCircle2,
  Clock,
  Plug,
  BarChart3,
} from "lucide-react"
import { Navbar } from "@/components/sections/navbar"

gsap.registerPlugin(ScrollTrigger)

/* ---------------- Data ---------------- */

const SERVICES = [
  {
    number: "01",
    title: "Websites",
    description:
      "Marketing sites and product pages built for the industry they serve.",
    items: ["Landing pages", "Product sites", "Design systems"],
  },
  {
    number: "02",
    title: "Software",
    description: "Custom applications that solve one problem well.",
    items: ["Web apps", "SaaS products", "Android apps"],
  },
  {
    number: "03",
    title: "Products",
    description: "Full builds from first sketch to production release.",
    items: ["MVP builds", "Full releases", "Maintenance"],
  },
  {
    number: "04",
    title: "Partnerships",
    description: "Ongoing engagements for teams shipping continuously.",
    items: ["Retainers", "Long-term work", "Advisory"],
  },
]

const PROCESS = [
  {
    number: "01",
    title: "Narrow",
    body: "Get specific before touching design.",
  },
  {
    number: "02",
    title: "Design",
    body: "Nail the core before adding anything else.",
  },
  { number: "03", title: "Ship", body: "Deploy, watch, iterate." },
]

const DUELY_STEPS = [
  {
    id: "sync",
    kicker: "Connect",
    title: "Duely plugs into your payment system.",
    body: "Duely reads your existing invoices and payments directly. No migration, no new ledger to maintain. It knows who owes, who paid, and how much, the moment it changes.",
    icon: Plug,
    screen: "invoices" as const,
    bullets: [
      "Reads existing invoices",
      "Real-time payment sync",
      "Zero data re-entry",
    ],
  },
  {
    id: "track",
    kicker: "Track",
    title: "Every reminder, tracked to the open.",
    body: "Each client email Duely sends is logged the moment it lands. You see who opened it, who ignored it, and who never received it, per invoice, per client, per day.",
    icon: Mail,
    screen: "email" as const,
    bullets: ["Delivery confirmed", "Open tracking", "Per-client history"],
  },
  {
    id: "respond",
    kicker: "Respond",
    title: "Know who replied before you chase.",
    body: "Client responses are matched back to the invoice automatically. No more wondering whether the message arrived. The answer is already on the screen, with the exact quote and timestamp.",
    icon: CheckCircle2,
    screen: "response" as const,
    bullets: [
      "Auto-matched replies",
      "Reply snippets",
      "Follow-up suggestions",
    ],
  },
  {
    id: "decide",
    kicker: "Decide",
    title: "The head of payments gets one clean dashboard.",
    body: "Outstanding balance, open emails, replied clients, cash expected this week. Every metric the head of payments needs to make a decision, in one glance. Built on a personalised dashboard layer, fully branded to your business.",
    icon: BarChart3,
    screen: "dashboard" as const,
    bullets: ["Custom metrics", "Personalised layout", "Real-time sync"],
  },
]

const APPROACH = [
  { title: "One hand, full stack", body: "No handoffs. No lost context." },
  { title: "Niche first", body: "Built for one industry, not the average." },
  { title: "Ship early", body: "Launch, then sharpen." },
  { title: "Built to last", body: "Clean code, documented, ready." },
]

const STATS = [
  { value: 4, label: "Services", suffix: "" },
  { value: 12, label: "Products explored", suffix: "+" },
  { value: 100, label: "Solo-built", suffix: "%" },
  { value: 6, label: "Industries served", suffix: "" },
]

/* ---------------- Page ---------------- */

export default function Home() {
  const [loaderDone, setLoaderDone] = React.useState(false)

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
      PerformanceNavigationTiming | undefined
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
        <Hero loaderDone={loaderDone} />
        <Marquee />
        <Intro />
        <Services />
        <Process />
        <Stats />
        <DuelyExplainer />
        <Approach />
        <Philosophy />
        <Contact />
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

function WordRevealText({
  text,
  className = "",
  from = 0.15,
}: {
  text: string
  className?: string
  from?: number
}) {
  const ref = React.useRef<HTMLParagraphElement>(null)
  useGSAP(() => {
    const words = ref.current?.querySelectorAll<HTMLElement>(".reveal-word")
    if (!words?.length) return
    gsap.fromTo(
      words,
      { opacity: from },
      {
        opacity: 1,
        stagger: 0.04,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          end: "bottom 45%",
          scrub: 1,
        },
      }
    )
  }, [from])
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="reveal-word mr-[0.25em] inline-block">
          {w}
        </span>
      ))}
    </p>
  )
}

function MagneticCTA({
  href,
  children,
}: {
  href: string
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
      className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background"
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

/* ---------------- Phone frame + Duely screens ---------------- */

function PhoneMockup({
  screen,
}: {
  screen: "invoices" | "email" | "response" | "dashboard"
}) {
  return (
    <div className="relative mx-auto w-full max-w-[260px]">
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2rem] border-[6px] border-zinc-800 bg-card shadow-[0_25px_60px_-20px_rgba(0,0,0,0.5)] dark:shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9)]">
        <div className="absolute top-2 left-1/2 z-20 h-2 w-2 -translate-x-1/2 rounded-full bg-zinc-800" />
        <div className="flex justify-between px-5 pt-2 font-mono text-[8px] font-medium text-foreground/60">
          <span>9:41</span>
          <span className="flex items-center gap-1.5">
            <span>5G</span>
            <span>▮</span>
          </span>
        </div>
        <div className="px-4 pt-3 pb-4">
          {screen === "invoices" && <InvoicesScreen />}
          {screen === "email" && <EmailScreen />}
          {screen === "response" && <ResponseScreen />}
          {screen === "dashboard" && <DashboardScreen />}
        </div>
      </div>
    </div>
  )
}

function InvoicesScreen() {
  const rows = [
    { name: "Northwind", amount: "$2,400", status: "Due" },
    { name: "Halo Labs", amount: "$1,850", status: "Sent" },
    { name: "Craft & Co.", amount: "$3,200", status: "Due" },
    { name: "Ardent", amount: "$970", status: "Paid" },
  ]
  return (
    <>
      <p className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground uppercase">
        Synced from payments
      </p>
      <p className="mt-1 text-2xl font-medium tracking-tight">$8,420</p>
      <p className="mt-0.5 font-mono text-[8px] text-muted-foreground">
        outstanding across 4 clients
      </p>
      <div className="mt-4 space-y-2">
        {rows.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="rounded-md border border-border bg-background/40 p-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium">{r.name}</span>
              <span
                className={`font-mono text-[7px] tracking-wider uppercase ${r.status === "Paid" ? "text-foreground" : r.status === "Due" ? "text-foreground/70" : "text-muted-foreground"}`}
              >
                {r.status}
              </span>
            </div>
            <div className="mt-1 font-mono text-[9px] text-muted-foreground tabular-nums">
              {r.amount}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}

function EmailScreen() {
  const mails = [
    { client: "Public", state: "Opened 2x", tone: "open" as const },
    { client: "Halo Labs", state: "Delivered", tone: "sent" as const },
    { client: "Craft & Co.", state: "Opened 1x", tone: "open" as const },
    { client: "Ardent", state: "Paid", tone: "paid" as const },
  ]
  return (
    <>
      <p className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground uppercase">
        Reminder tracking
      </p>
      <p className="mt-1 text-2xl font-medium tracking-tight">3 opened</p>
      <p className="mt-0.5 font-mono text-[8px] text-muted-foreground">
        of 4 emails sent today
      </p>
      <div className="mt-4 space-y-2">
        {mails.map((m, i) => (
          <motion.div
            key={m.client}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="flex items-center justify-between rounded-md border border-border bg-background/40 p-2.5"
          >
            <div className="flex items-center gap-2">
              {m.tone === "open" && (
                <MailOpen className="h-3 w-3 text-foreground" />
              )}
              {m.tone === "sent" && (
                <Mail className="h-3 w-3 text-muted-foreground" />
              )}
              {m.tone === "paid" && (
                <CheckCircle2 className="h-3 w-3 text-foreground" />
              )}
              <span className="text-[10px] font-medium">{m.client}</span>
            </div>
            <span className="font-mono text-[8px] text-muted-foreground">
              {m.state}
            </span>
          </motion.div>
        ))}
      </div>
    </>
  )
}

function ResponseScreen() {
  const responses = [
    { client: "Northwind", reply: "Paying Friday", tone: "ok" as const },
    { client: "Craft & Co.", reply: "Sent to accounts", tone: "ok" as const },
    { client: "Ardent", reply: "Paid", tone: "done" as const },
    { client: "Halo Labs", reply: "No reply yet", tone: "wait" as const },
  ]
  return (
    <>
      <p className="font-mono text-[8px] tracking-[0.2em] text-muted-foreground uppercase">
        Responses
      </p>
      <p className="mt-1 text-2xl font-medium tracking-tight">3 replied</p>
      <p className="mt-0.5 font-mono text-[8px] text-muted-foreground">
        matched to invoices automatically
      </p>
      <div className="mt-4 space-y-2">
        {responses.map((r, i) => (
          <motion.div
            key={r.client}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.45, delay: i * 0.09, ease: "easeOut" }}
            className="rounded-md border border-border bg-background/40 p-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium">{r.client}</span>
              {r.tone === "wait" ? (
                <Clock className="h-3 w-3 text-muted-foreground" />
              ) : (
                <CheckCircle2 className="h-3 w-3 text-foreground" />
              )}
            </div>
            <p className="mt-0.5 text-[9px] text-muted-foreground">{r.reply}</p>
          </motion.div>
        ))}
      </div>
    </>
  )
}

/* Full gridded dashboard used in the hero phone */
function DashboardScreen() {
  const kpis = [
    { label: "Outstanding", value: "$8.4k", accent: "text-amber-600" },
    { label: "Collected", value: "$12.4k", accent: "text-emerald-600" },
    { label: "Open rate", value: "68%", accent: "text-foreground" },
    { label: "Replies", value: "3", accent: "text-foreground" },
  ]
  const bars = [42, 68, 51, 82, 60, 92, 74]
  const activity = [
    { client: "Northwind", what: "Opened reminder", when: "2m" },
    { client: "Craft Co.", what: "Replied, paying Fri", when: "18m" },
    { client: "Halo Labs", what: "Reminder sent", when: "1h" },
  ]
  return (
    <div className="flex h-full flex-col gap-2">
      {/* App header */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-1.5">
          <div className="grid h-4 w-4 place-items-center rounded-sm bg-foreground">
            <span className="text-[6px] font-bold text-background">D</span>
          </div>
          <span className="text-[10px] font-semibold tracking-tight">
            Duely
          </span>
        </div>
        <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-[6px] tracking-wider text-muted-foreground uppercase">
          Sep 12
        </span>
      </motion.div>

      {/* 2x2 KPI grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{
              duration: 0.4,
              delay: 0.1 + i * 0.06,
              ease: "easeOut",
            }}
            className="rounded-md border border-border bg-background/40 p-1.5"
          >
            <p className="font-mono text-[6px] tracking-wider text-muted-foreground uppercase">
              {k.label}
            </p>
            <p
              className={`mt-0.5 text-[11px] font-semibold tabular-nums ${k.accent}`}
            >
              {k.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Cash flow chart */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="rounded-md border border-border bg-background/40 p-1.5"
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-[6px] tracking-wider text-muted-foreground uppercase">
            Cash flow
          </p>
          <span className="font-mono text-[6px] font-medium text-emerald-600">
            +12.4%
          </span>
        </div>
        <div className="mt-1.5 flex h-10 items-end gap-0.5">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: false }}
              transition={{
                duration: 0.6,
                delay: 0.4 + i * 0.05,
                ease: "easeOut",
              }}
              className="flex-1 rounded-t bg-foreground/80"
            />
          ))}
        </div>
      </motion.div>

      {/* Live activity */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
        className="flex-1 rounded-md border border-border bg-background/40 p-1.5"
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-[6px] tracking-wider text-muted-foreground uppercase">
            Activity
          </p>
          <span className="font-mono text-[6px] text-muted-foreground">
            Live
          </span>
        </div>
        <div className="mt-1 space-y-1">
          {activity.map((a, i) => (
            <div key={i} className="flex items-center justify-between gap-1">
              <div className="min-w-0">
                <p className="truncate text-[7px] font-medium">{a.client}</p>
                <p className="truncate font-mono text-[6px] text-muted-foreground">
                  {a.what}
                </p>
              </div>
              <span className="shrink-0 font-mono text-[6px] text-muted-foreground">
                {a.when}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ---------------- Hero ---------------- */

function Hero({ loaderDone }: { loaderDone: boolean }) {
  const ref = React.useRef<HTMLElement>(null)
  const phoneRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.set(".hero-sub", { opacity: 0, y: 24 })
      gsap.set(".hero-cta > *", { opacity: 0, y: 16 })
      gsap.set(".hero-live", { opacity: 0, y: 12 })
      gsap.set(".hero-scroll", { opacity: 0, y: 12 })
      if (phoneRef.current) {
        gsap.set(phoneRef.current, {
          opacity: 0,
          y: 80,
          scale: 0.72,
          rotateY: 60,
          rotateX: 10,
          filter: "blur(16px)",
          transformPerspective: 1400,
          transformOrigin: "center center",
        })
      }
    },
    { scope: ref }
  )

  useGSAP(
    () => {
      if (!loaderDone) return
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
      tl.to(".hero-sub", { opacity: 1, y: 0, duration: 0.9 }, 0.1)
      tl.to(
        ".hero-cta > *",
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
        0.35
      )
      tl.to(".hero-live", { opacity: 1, y: 0, duration: 0.6 }, 0.55)
      tl.to(".hero-scroll", { opacity: 1, y: 0, duration: 0.6 }, 0.7)
      if (phoneRef.current) {
        tl.to(
          phoneRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 1.4,
            ease: "power4.out",
          },
          0
        )
      }
    },
    { scope: ref, dependencies: [loaderDone] }
  )

  useGSAP(
    () => {
      if (!phoneRef.current) return
      gsap.to(phoneRef.current, {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    },
    { scope: ref }
  )

  return (
    <section
      ref={ref}
      className="relative mx-auto max-w-[1600px] px-6 pt-24 pb-40 sm:px-10 sm:pt-32 sm:pb-52 lg:px-14 lg:pb-64"
    >
      <p className="hero-eyebrow font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
        <SplitChars
          text="Duely by NexlyDevs"
          play={loaderDone}
          stagger={0.02}
        />
      </p>

      <h1 className="hero-title mt-10 max-w-[14ch] text-[clamp(4rem,11vw,10rem)] leading-[0.88] font-normal tracking-tighter">
        <SplitWords
          as="span"
          text="Software
built
for
the
niche
it
serves."
          stagger={0.08}
          play={loaderDone}
          className="block"
        />
      </h1>

      <div className="mt-24 grid items-start gap-20 lg:grid-cols-[1.1fr_1fr] lg:gap-28">
        <div>
          <p className="hero-sub max-w-xl text-lg leading-relaxed sm:text-xl">
            Duely is a payment recovery platform. It connects to your payment
            system and shows you which clients owe you, who has been emailed,
            who opened the reminder, and who replied. One dashboard for the
            entire collections process.
          </p>

          {/* 🚨 UPDATED BUTTONS HERE */}
          <div className="hero-cta mt-14 flex flex-wrap items-center gap-3">
            <MagneticCTA href="#duely">See how Duely works</MagneticCTA>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium transition-colors hover:bg-foreground/5"
            >
              Get Duely
            </Link>
          </div>

          <div className="hero-live mt-16 flex items-center gap-2.5">
            <span className="inline-flex h-2 w-2 rounded-full bg-foreground" />
            <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
              Currently building Duely
            </span>
          </div>

          <div className="hero-scroll mt-20 flex items-center gap-3">
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
        </div>

        <div className="relative mx-auto w-full max-w-[300px] lg:mr-0 lg:ml-auto">
          <div ref={phoneRef}>
            <PhoneMockup screen="dashboard" />
          </div>
        </div>
      </div>
    </section>
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

  const items = [
    "nexlydevs",
    "duely",
    "payments",
    "reminders",
    "recovery",
    "dashboard",
    "software",
    "studio",
  ]

  return (
    <div
      ref={ref}
      className="relative overflow-hidden border-y border-foreground bg-foreground py-6"
      aria-hidden
    >
      <div className="nx-marquee-track flex w-[200%] will-change-transform">
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 items-center">
            {items.map((t, i) => (
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

/* ---------------- Intro (defines the site) ---------------- */

function Intro() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-40 sm:px-10 sm:py-56 lg:px-14">
      <div className="max-w-4xl">
        <SectionLabel index="00" trailing="Overview">
          Introduction
        </SectionLabel>
        <h2 className="mt-12 text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] font-normal tracking-tight">
          NexlyDevs is a development studio. Duely is our first product.
        </h2>
        <WordRevealText
          from={0.1}
          className="mt-10 text-[clamp(1.25rem,2.4vw,1.75rem)] leading-[1.4] text-muted-foreground"
          text="Most business software is built for everyone and fits no one. Duely is built for one job. Making sure businesses get paid on time, without chasing clients by hand."
        />
      </div>
    </section>
  )
}

/* ---------------- Services ---------------- */

function Services() {
  const ref = React.useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.from(".service-card", {
        opacity: 0,
        y: 60,
        rotateX: -12,
        filter: "blur(12px)",
        transformOrigin: "center top",
        duration: 1.2,
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
      id="services"
      className="mx-auto max-w-[1600px] scroll-mt-20 px-6 py-40 sm:px-10 sm:py-56 lg:px-14"
    >
      <div className="grid gap-20 lg:grid-cols-[1fr_2fr] lg:gap-28">
        <div>
          <SectionLabel index="01" trailing="04 total">
            Services
          </SectionLabel>
          <h2 className="mt-10 text-[clamp(3rem,7vw,6rem)] leading-[0.92] font-normal tracking-tighter">
            <SplitWords text="What we build." stagger={0.08} />
          </h2>
        </div>

        <div className="grid gap-x-16 gap-y-20 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <div key={s.number} className="service-card">
              <span className="font-mono text-[11px] text-muted-foreground">
                {s.number}
              </span>
              <h3 className="mt-6 text-2xl font-medium tracking-tight">
                {s.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {s.description}
              </p>
              <ul className="mt-8 space-y-2.5">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground"
                  >
                    <span className="h-1 w-1 rounded-full bg-current opacity-60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Process ---------------- */

function Process() {
  const ref = React.useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.from(".process-step", {
        opacity: 0,
        y: 40,
        filter: "blur(6px)",
        duration: 1,
        stagger: 0.15,
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
      className="mx-auto max-w-[1600px] px-6 py-40 sm:px-10 sm:py-56 lg:px-14"
    >
      <div className="grid gap-20 lg:grid-cols-[1fr_2fr] lg:gap-28">
        <div>
          <SectionLabel index="02" trailing="03 steps">
            Process
          </SectionLabel>
          <h2 className="mt-10 text-[clamp(3rem,7vw,6rem)] leading-[0.92] font-normal tracking-tighter">
            <SplitWords text="How it ships." stagger={0.08} />
          </h2>
        </div>
        <div className="space-y-16">
          {PROCESS.map((step) => (
            <div
              key={step.number}
              className="process-step grid gap-6 sm:grid-cols-[4rem_1fr]"
            >
              <div className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
                {step.number}
              </div>
              <div>
                <h3 className="text-3xl font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Stats ---------------- */

function Stats() {
  const ref = React.useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        const target = parseInt(el.dataset.value || "0", 10)
        const suffix = el.dataset.suffix || ""
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            el.textContent = Math.floor(obj.val) + suffix
          },
        })
      })
    },
    { scope: ref }
  )
  return (
    <section
      ref={ref}
      className="mx-auto max-w-[1600px] px-6 py-20 sm:px-10 sm:py-24 lg:px-14"
    >
      <div className="grid gap-12 py-20 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-normal tracking-tighter">
              <span
                className="stat-value"
                data-value={s.value}
                data-suffix={s.suffix}
              >
                0
              </span>
            </div>
            <div className="mt-4 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Duely explainer (product section) ---------------- */

function DuelyExplainer() {
  const ref = React.useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (!ref.current) return
      gsap.from(".duely-card", {
        opacity: 0,
        y: 80,
        filter: "blur(8px)",
        duration: 1.1,
        stagger: 0.15,
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
      id="duely"
      className="relative scroll-mt-20 py-40 sm:py-56"
    >
      <div className="mx-auto mb-24 max-w-[1600px] px-6 sm:px-10 lg:px-14">
        <SectionLabel index="03" trailing="Duely">
          Product
        </SectionLabel>
        <h2 className="mt-10 max-w-4xl text-[clamp(3rem,7vw,6rem)] leading-[0.92] font-normal tracking-tighter">
          <SplitWords text="Meet Duely." stagger={0.07} />
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Duely is a payment recovery platform for small and mid-sized
          businesses. It connects to your existing payment system, tracks every
          reminder email, and gives the head of payments one clean dashboard for
          every open invoice. No migration. No manual chasing. No guessing.
        </p>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        {DUELY_STEPS.map((step, i) => {
          const Icon = step.icon
          return (
            <div
              key={step.id}
              className="duely-card sticky top-24"
              style={{
                zIndex: i + 1,
                marginBottom: i === DUELY_STEPS.length - 1 ? 0 : "4rem",
              }}
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_25px_60px_-30px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_80px_-25px_rgba(0,0,0,0.7)]">
                <div className="grid lg:grid-cols-[1.15fr_1fr]">
                  <div className="flex flex-col justify-between p-10 sm:p-14 lg:p-20">
                    <div>
                      <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
                        <span className="inline-flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5" />
                          <span>{String(i + 1).padStart(2, "0")}</span>
                        </span>
                        <span className="opacity-60">/</span>
                        <span>{step.kicker}</span>
                      </div>
                      <h3 className="mt-10 text-[clamp(2rem,4vw,3.5rem)] leading-[1.02] font-normal tracking-tighter">
                        {step.title}
                      </h3>
                      <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                    <ul className="mt-14 space-y-3">
                      {step.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground"
                        >
                          <span className="h-1 w-1 rounded-full bg-current opacity-60" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-center bg-muted/30 p-10 sm:p-14 lg:p-20">
                    <PhoneMockup screen={step.screen} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------- Approach ---------------- */

function Approach() {
  const ref = React.useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.from(".approach-row", {
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
      className="mx-auto max-w-[1600px] px-6 py-40 sm:px-10 sm:py-56 lg:px-14"
    >
      <div className="grid gap-20 lg:grid-cols-[1fr_2fr] lg:gap-28">
        <div>
          <SectionLabel index="04" trailing="04 rules">
            Approach
          </SectionLabel>
          <h2 className="mt-10 text-[clamp(3rem,7vw,6rem)] leading-[0.92] font-normal tracking-tighter">
            <SplitWords text="How we work." stagger={0.08} />
          </h2>
        </div>
        <div className="space-y-14">
          {APPROACH.map((row, i) => (
            <div
              key={row.title}
              className="approach-row grid gap-6 sm:grid-cols-[3rem_1fr]"
            >
              <div className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="text-xl font-medium tracking-tight">
                  {row.title}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {row.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Philosophy ---------------- */

function Philosophy() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-40 sm:px-10 sm:py-56 lg:px-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
          Principle
        </p>
        <WordRevealText
          from={0.1}
          className="mt-12 text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.3] tracking-tight"
          text="Good software does not ask for attention. It does its job and gets out of the way."
        />
      </div>
    </section>
  )
}

/* ---------------- Contact ---------------- */

function Contact() {
  const ref = React.useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.from(".contact-line", {
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
      gsap.from(".contact-cta", {
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
      id="contact"
      className="relative mx-auto max-w-[1600px] scroll-mt-20 px-6 py-40 sm:px-10 sm:py-56 lg:px-14"
    >
      <SectionLabel index="05" trailing="Open for 2026">
        Contact
      </SectionLabel>
      <h2 className="mt-10 max-w-6xl text-[clamp(3rem,8vw,8rem)] leading-[0.9] font-normal tracking-tighter">
        <span className="block overflow-hidden">
          <span className="contact-line block">Have something</span>
        </span>
        <span className="block overflow-hidden">
          <span className="contact-line block">worth building?</span>
        </span>
      </h2>
      <p className="mt-16 max-w-md text-base leading-relaxed text-muted-foreground">
        Taking on a small number of projects. If it is a fit, we reply within a
        day.
      </p>
      <div className="contact-cta mt-16 flex flex-wrap items-center gap-4">
        <MagneticCTA href="/contact">Start a project</MagneticCTA>
      </div>
    </section>
  )
}