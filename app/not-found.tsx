import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="relative min-h-[calc(100svh-5rem)] flex items-center justify-center overflow-hidden px-6 py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 55% at 50% 45%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 65%)',
          opacity: 0.6,
        }}
      />

      <div className="relative max-w-3xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Error / 404
        </p>

        <h1 className="mt-10 flex items-center justify-center text-[clamp(6rem,18vw,14rem)] font-normal leading-[0.85] tracking-tighter">
          404
        </h1>

        <p className="mx-auto mt-10 max-w-md text-base leading-relaxed text-muted-foreground">
          The page you are looking for does not exist.
        </p>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
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

        <div className="mt-24 flex items-center justify-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />
          </span>
          <span>NexlyDevs</span>
        </div>
      </div>
    </main>
  )
}
