'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AboutPage() {
  const container = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useGSAP(() => {
    // Header reveal
    gsap.from('.about-header', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })

    // Word-by-word manifesto reveal
    if (textRef.current) {
      const words = textRef.current.innerText.split(' ')
      textRef.current.innerHTML = words.map(word => `<span class="inline-block">${word}</span>`).join(' ')
      
      gsap.from(textRef.current.querySelectorAll('span'), {
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
        },
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.02,
        ease: 'power2.out',
      })
    }
  }, { scope: container })

  return (
    <div ref={container} className="container mx-auto px-6 sm:px-10 lg:px-14 py-24 sm:py-32 mt-16 md:mt-20 max-w-5xl">
      <div className="about-header">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight mb-12">
          Building with <br className="hidden sm:block" />
          <span className="text-muted-foreground">intention.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20">
        <div className="md:col-span-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground sticky top-32">
            The Studio
          </h2>
        </div>
        
        <div className="md:col-span-8 space-y-8 text-lg text-foreground/80 leading-relaxed">
          <p ref={textRef}>
            NexlyDevs is a micro development studio. We believe that the best software isn't built by massive teams rushing to meet arbitrary deadlines—it's built by small, focused groups of engineers who care deeply about the details. We operate differently. Instead of taking on dozens of projects, we take on a select few.
          </p>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-foreground font-medium border-l-2 border-foreground/20 pl-6 py-2 my-8 italic"
          >
            "We don't just write code. We design solutions that feel inevitable, intuitive, and beautifully engineered."
          </motion.p>
          
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/60">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-3xl font-medium mb-2">100%</h3>
              <p className="text-sm text-muted-foreground">Custom built. No templates.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-3xl font-medium mb-2">0</h3>
              <p className="text-sm text-muted-foreground">Generic AI artifacts.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}