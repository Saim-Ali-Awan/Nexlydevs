'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    title: 'Web Development',
    description: 'High-performance, responsive websites and SaaS applications built with Next.js, React, and Tailwind CSS.',
    deliverables: ['Next.js App Router', 'Supabase Integration', 'SEO Optimization', 'Payment Gateways']
  },
  {
    title: 'Software Engineering',
    description: 'Custom internal tools, complex dashboards, and scalable backend architectures designed for growth.',
    deliverables: ['REST & GraphQL APIs', 'Role-Based Access', 'Real-time Data', 'Cloud Infrastructure']
  },
  {
    title: 'Android Apps',
    description: 'Native-feeling mobile experiences that connect seamlessly with your web ecosystem.',
    deliverables: ['Kotlin / Jetpack Compose', 'Offline Support', 'Push Notifications', 'Play Store Deployment']
  }
]

export default function ServicesPage() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.services-header', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })

    gsap.from('.service-row', {
      scrollTrigger: {
        trigger: '.services-list',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
    })
  }, { scope: container })

  return (
    <div ref={container} className="container mx-auto px-6 sm:px-10 lg:px-14 py-24 sm:py-32 mt-16 md:mt-20">
      <div className="services-header max-w-3xl mb-24">
        <h1 className="text-4xl sm:text-6xl font-medium tracking-tight mb-6">
          Capabilities.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We are a micro-studio. We do not build generic templates. We partner with specific industries to build software that solves precise problems.
        </p>
      </div>

      <div className="services-list border-t border-border/60">
        {services.map((service) => (
          <div 
            key={service.title}
            className="service-row grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-border/60 hover:bg-muted/30 transition-colors px-4 -mx-4 rounded-xl"
          >
            <div className="md:col-span-5 flex flex-col justify-start">
              <h2 className="text-2xl font-medium tracking-tight mb-4">{service.title}</h2>
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                {service.description}
              </p>
            </div>
            
            <div className="md:col-span-7 flex items-center">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 w-full">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                    <span className="text-muted-foreground/50 font-mono text-xs">/</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}