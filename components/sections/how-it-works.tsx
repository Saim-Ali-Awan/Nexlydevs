'use client'

import * as React from 'react'
import { UploadCloud, SlidersHorizontal, Send } from 'lucide-react'
import { FadeInUp, Stagger, StaggerItem } from '@/components/motion/frammer-wrapper'

const STEPS = [
  { step: 1, icon: UploadCloud, title: 'Connect your invoices', description: 'Upload a CSV of your outstanding invoices, or paste them in. Duely reads client name, email, amount, and due date — no spreadsheet gymnastics.' },
  { step: 2, icon: SlidersHorizontal, title: 'Pick your reminder rules', description: 'Choose how many reminders, on which days, and in which tone. Save the rule once. Every new invoice inherits it.' },
  { step: 3, icon: Send, title: 'Duely sends them for you', description: 'On schedule, in your brand. You see opens and replies in one dashboard. Your clients get a friendly, professional reminder.' },
] as const

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-heading" className="relative py-20 sm:py-28 border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <FadeInUp>
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">How it works</p>
            <h2 id="how-heading" className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Three steps to never chase an invoice again.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              From CSV to first sent reminder in under five minutes. No integrations required to start — add Stripe later when you want auto-reconciliation.
            </p>
          </div>
        </FadeInUp>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-3 relative" stagger={0.15}>
          <div aria-hidden className="hidden md:block absolute top-9 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          {STEPS.map((step) => (
            <StaggerItem key={step.step}>
              <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative z-10 mb-5">
                  <span className="grid h-[72px] w-[72px] place-items-center rounded-full border border-border bg-card text-primary shadow-lg shadow-black/20">
                    <step.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-mono font-bold text-primary-foreground">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs md:max-w-none">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}