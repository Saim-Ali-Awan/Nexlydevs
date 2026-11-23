'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FadeInUp } from '@/components/motion/frammer-wrapper'

const FAQS = [
  {
    q: 'What does Duely actually do?',
    a: 'Duely sends automatic email reminders to your clients about unpaid invoices. You upload your invoice list (CSV), set a rule (e.g. "3 days before due date, send a friendly nudge"), and Duely handles the rest — including escalating tone and final notices.',
  },
  {
    q: 'Do I need Stripe to use Duely?',
    a: 'No. Duely works standalone with CSV import. Stripe auto-reconciliation is a Business-plan feature for teams that want Duely to mark invoices as "paid" automatically when Stripe receives a payment.',
  },
  {
    q: 'How is Duely different from a regular email scheduler?',
    a: 'Three things: (1) Duely understands invoice due dates and schedules reminders around them, not around arbitrary dates. (2) It escalates tone automatically — friendly → firm → final — across multiple touches. (3) It tracks opens and replies so you know who actually needs a personal follow-up.',
  },
  {
    q: 'Can I brand the reminder emails?',
    a: 'Yes, on Pro and Business plans. Add your logo, pick your colors, write custom copy. Free plan includes a small "Sent via Duely" footer.',
  },
  {
    q: 'Is Duely GDPR and CAN-SPAM compliant?',
    a: 'Yes. Duely automatically includes unsubscribe links in every email, processes opt-outs within 10 seconds, and stores all data in the EU (Frankfurt) for GDPR. We do not sell or share your client list — ever.',
  },
  {
    q: 'When is Duely launching?',
    a: 'Duely is in private beta right now. Join the waitlist — we onboard 10 new users every week. Public launch is planned for early next year.',
  },
  {
    q: 'I am based in Pakistan — can I pay?',
    a: 'Yes. We accept payments via Paddle (global) and Payoneer. Both work for Pakistani customers. If you have a specific payment issue, email hello@nexly.dev and we will sort it out personally.',
  },
] as const

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative py-20 sm:py-28 border-t border-border bg-card/30"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
        <FadeInUp>
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              FAQ
            </p>
            <h2
              id="faq-heading"
              className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
            >
              Questions, answered.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Everything you might be wondering about Duely. Still curious?{' '}
              <a
                href="mailto:hello@nexly.dev"
                className="text-foreground underline underline-offset-4 hover:text-primary"
              >
                Email us
              </a>
              .
            </p>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="mt-10 w-full">
            {FAQS.map((faq, i) => (
              <AccordionRow
                key={faq.q}
                question={faq.q}
                answer={faq.a}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

function AccordionRow({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${question.slice(0, 20)}`}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-md"
      >
        <span>{question}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
          aria-hidden
        />
      </button>

      {/* Smooth height animation via CSS grid trick — no JS animation needed */}
      <div
        id={`faq-panel-${question.slice(0, 20)}`}
        role="region"
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}