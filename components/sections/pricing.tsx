'use client'

import * as React from 'react'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeInUp, Stagger, StaggerItem } from '@/components/motion/frammer-wrapper'
import { cn } from '@/lib/utils'

type Plan = {
  name: string
  monthly: number
  description: string
  features: string[]
  cta: string
  ctaHref: string
  featured?: boolean
}

const PLANS: Plan[] = [
  {
    name: 'Free',
    monthly: 0,
    description: 'For solo founders with a handful of clients.',
    features: [
      'Up to 5 clients',
      'CSV import',
      '1 reminder rule',
      'Duely branding on emails',
      'Community support',
    ],
    cta: 'Start free',
    ctaHref: '#waitlist',
  },
  {
    name: 'Pro',
    monthly: 19,
    description: 'For freelancers and small agencies getting serious.',
    features: [
      'Up to 200 clients',
      'Unlimited reminder rules',
      'Branded email templates',
      'Open & reply tracking',
      'Email support (24h)',
    ],
    cta: 'Join waitlist for Pro',
    ctaHref: '#waitlist',
    featured: true,
  },
  {
    name: 'Business',
    monthly: 49,
    description: 'For teams that need volume and control.',
    features: [
      'Unlimited clients',
      'Multi-user (up to 5 seats)',
      'Stripe auto-reconciliation',
      'Custom sending domain',
      'Priority support (4h)',
    ],
    cta: 'Join waitlist for Business',
    ctaHref: '#waitlist',
  },
]

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="relative py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <FadeInUp>
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Pricing</p>
            <h2 id="pricing-heading" className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Simple pricing. No surprises.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Start free forever. Upgrade when your client list grows. Prices in USD — billed monthly, cancel anytime.
            </p>
          </div>
        </FadeInUp>

        <Stagger className="mt-12 grid gap-4 sm:gap-6 md:grid-cols-3 items-start" stagger={0.1}>
          {PLANS.map((plan) => (
            <StaggerItem key={plan.name}>
              <Card
                className={cn(
                  'relative h-full border-border bg-card transition-colors',
                  plan.featured
                    ? 'border-primary/50 shadow-lg shadow-primary/5 md:scale-[1.02]'
                    : 'hover:border-primary/30'
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="rounded-full px-3 py-1 text-[10px] uppercase tracking-wider">
                      Most popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="p-5 sm:p-6">
                  <CardTitle className="text-base font-semibold tracking-tight">{plan.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{plan.description}</CardDescription>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-semibold tracking-tight">${plan.monthly}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                </CardHeader>

                <CardContent className="px-5 sm:px-6 pb-2">
                  <ul className="flex flex-col gap-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-5 sm:p-6 pt-2">
                  <Button
                    asChild
                    variant={plan.featured ? 'default' : 'outline'}
                    className="w-full rounded-full"
                  >
                    <Link href={plan.ctaHref}>
                      {plan.cta}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          All plans include GDPR & CAN-SPAM compliance. Cancel anytime — no questions asked.
        </p>
      </div>
    </section>
  )
}