'use client'

import * as React from 'react'

export function CustomScrollbar() {
  const [progress, setProgress] = React.useState(0)
  const [visible, setVisible] = React.useState(false)
  const [hover, setHover] = React.useState(false)

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined

    const show = () => {
      timer = setTimeout(() => setVisible(true), 400)
    }

    if (!document.documentElement.classList.contains('is-loading')) {
      show()
    } else {
      window.addEventListener('nexly:loader-exit', show, { once: true })
    }

    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('nexly:loader-exit', show)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-4 top-1/2 z-[90] hidden h-[40vh] w-[3px] -translate-y-1/2 md:block"
    >
      <div
        className={`pointer-events-auto h-full w-full transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
        }`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className={`relative h-full w-full transition-colors duration-300 ${
            hover ? 'bg-foreground/10' : 'bg-foreground/5'
          }`}
        >
          <div
            className="absolute inset-x-0 bg-foreground/40 transition-[top] duration-100"
            style={{
              top: `${progress * 80}%`,
              height: '20%',
            }}
          />
        </div>
      </div>
    </div>
  )
}