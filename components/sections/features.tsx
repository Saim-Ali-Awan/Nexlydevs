'use client'

import * as React from 'react'
import { Clock, Bell, Layers, ShieldCheck, Mail, Gauge } from 'lucide-react'
import { FadeInUp, Stagger, StaggerItem } from '@/components/motion/frammer-wrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const FEATURES = [
  { icon: Clock, title: 'Smart timing', description: 'Duely watches invoice due dates and sends reminders at the optimal moment — 3 days before, on the day, and 7 days after. No manual setup per invoice.' },
  { icon: Bell, title: 'Escalating tone', description: 'Three-step escalation: friendly nudge → firm reminder → final notice. Pick the tone that fits your client relationship, or let Duely auto-pick.' },
  { icon: Layers, title: 'Batch sending', description: 'Upload 100 invoices via CSV and Duely queues every reminder automatically. No per-invoice clicking.' },
  { icon: Mail, title: 'Branded templates', description: 'Your logo, your colors, your voice. Reminder emails look like they came from your team — because they did.' },
  { icon: Gauge, title: 'Open & reply tracking', description: 'See which clients opened your reminder and which still owe you a reply. Know when to follow up yourself.' },
  { icon: ShieldCheck, title: 'Quiet, safe sending', description: 'Respects CAN-SPAM, GDPR opt-outs, and unsubscribe links automatically. Built for businesses, not spammers.' },
] as const

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="relative py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <FadeInUp>
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Duely · Features</p>
            <h2 id="features-heading" className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Everything Duely does, so you don&apos;t have to.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Six focused capabilities that turn &quot;chasing payments&quot; from a stressful weekly task into something that just happens in the background.
            </p>
          </div>
        </FadeInUp>

        <Stagger className="mt-12 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title}>
              <Card className="group h-full border-border bg-card/60 transition-colors hover:border-primary/40 hover:bg-card">
                <CardHeader className="p-5 sm:p-6 space-y-3">
                  <span className="grid h-9 w-9 place-items-center rounded-md border border-border bg-muted/40 text-primary transition-transform group-hover:scale-110">
                    <feature.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <CardTitle className="text-base font-semibold tracking-tight">{feature.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}