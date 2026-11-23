'use client'

import * as React from 'react'
import { MailCheck, Calendar, FileText, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Stagger, StaggerItem } from '@/components/motion/frammer-wrapper'

type Product = {
  name: string
  tagline: string
  description: string
  status: 'live' | 'beta' | 'planned'
  icon: React.ComponentType<{ className?: string }>
  featured?: boolean
}

const PRODUCTS: Product[] = [
  {
    name: 'Duely',
    tagline: 'Payment-reminder emails, automated.',
    description: 'Connect your invoice list, set reminder rules, and Duely sends the right email at the right time — gentle nudges, escalating tones, and a final notice. Less awkward follow-up, faster cash flow.',
    status: 'beta',
    icon: MailCheck,
    featured: true,
  },
  {
    name: 'Scheduly',
    tagline: 'Client bookings without the back-and-forth.',
    description: 'A focused scheduling page that lets clients book time on your calendar. No double-bookings, no timezone math. Planned for Q1 next year.',
    status: 'planned',
    icon: Calendar,
  },
  {
    name: 'Draftly',
    tagline: 'Docs that ship with your product.',
    description: 'A docs site generator for small SaaS teams. Write in markdown, ship with your brand, get search out of the box. Planned for Q2 next year.',
    status: 'planned',
    icon: FileText,
  },
]

const STATUS_STYLES: Record<Product['status'], { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  live: { label: 'Live', variant: 'default' },
  beta: { label: 'In beta', variant: 'secondary' },
  planned: { label: 'Planned', variant: 'outline' },
}

export function Products() {
  return (
    <section id="products" aria-labelledby="products-heading" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-wider text-primary">Products</p>
          <h2 id="products-heading" className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
            One focused product at a time.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Nexly ships small SaaS products — each one solves a single, sharp problem. Duely is live in beta; the rest are on the roadmap.
          </p>
        </div>

        <Stagger className="mt-12 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {PRODUCTS.map((product) => (
            <StaggerItem key={product.name}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon
  const status = STATUS_STYLES[product.status]

  return (
    <Card
      className={cn(
        'group relative h-full overflow-hidden border-border bg-card transition-colors hover:border-primary/40',
        product.featured && 'md:col-span-2 lg:col-span-1'
      )}
    >
      {product.featured && (
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
      )}

      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md border border-border bg-muted/40 text-primary">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight">{product.name}</CardTitle>
            <CardDescription className="mt-1 text-xs font-mono text-muted-foreground">{product.tagline}</CardDescription>
          </div>
        </div>
        <Badge variant={status.variant} className="shrink-0 text-[10px]">{status.label}</Badge>
      </CardHeader>

      <CardContent className="px-5 sm:px-6 pb-6 pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <a
            href={product.status === 'planned' ? '#waitlist' : '#features'}
            className="inline-flex items-center gap-1 text-xs font-medium text-foreground transition-opacity hover:opacity-70"
          >
            {product.status === 'planned' ? 'Notify me' : 'Learn more'}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">by Nexly</span>
        </div>
      </CardContent>
    </Card>
  )
}