'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: 'Duely SaaS',
    category: 'Software / Product',
    year: '2024',
    description: 'A subscription-based workflow management tool designed for high-performing teams.',
    href: '/pricing',
  },
  {
    title: 'Aura Finance',
    category: 'Fintech / Web App',
    year: '2023',
    description: 'Modern banking dashboard with real-time analytics and seamless transfers.',
    href: '#',
  },
  {
    title: 'Nexly Android',
    category: 'Mobile / Consumer',
    year: '2023',
    description: 'A highly optimized Android application for on-the-go content creators.',
    href: '#',
  }
]

export default function WorkPage() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Animate the header
    gsap.from('.work-header', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })

    // Animate each project row on scroll
    gsap.utils.toArray<HTMLElement>('.project-row').forEach((row) => {
      gsap.from(row, {
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
    })

    // Animate the divider lines
    gsap.utils.toArray<HTMLElement>('.divider-line').forEach((line) => {
      gsap.from(line, {
        scrollTrigger: {
          trigger: line,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power3.inOut',
      })
    })
  }, { scope: container })

  return (
    <div ref={container} className="container mx-auto px-6 sm:px-10 lg:px-14 py-24 sm:py-32 mt-16 md:mt-20">
      <div className="work-header max-w-3xl">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight mb-6">
          Selected Work.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A showcase of software, websites, and applications we have engineered for specific industries. We focus on precision, performance, and premium user experiences.
        </p>
      </div>

      <div className="mt-24 border-t border-border/60">
        {projects.map((project, index) => (
          <div key={project.title} className="project-row group relative">
            <div className="divider-line absolute bottom-0 left-0 w-full h-px bg-border/60" />
            <Link href={project.href} className="block py-12 sm:py-16 transition-colors duration-500 hover:bg-muted/20 -mx-6 px-6 sm:-mx-10 sm:px-10 lg:-mx-14 lg:px-14 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-4 flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {project.category}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {project.year}
                  </span>
                </div>
                <div className="md:col-span-8 flex flex-col gap-4">
                  <h2 className="text-3xl sm:text-4xl font-medium tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                    {project.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                    {project.description}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}