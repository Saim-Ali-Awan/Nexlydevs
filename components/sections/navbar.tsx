'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Sun, Moon, X, LayoutDashboard, LogOut, Settings, Loader2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/toast'

const EASE = [0.16, 1, 0.3, 1] as const
const SLIDE_EASE = [0.76, 0, 0.24, 1] as const
const WIPE_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'

const NAV_ITEMS = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Studio', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
] as const

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'X', href: 'https://x.com' },
] as const

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => {
    ready: Promise<void>
    finished: Promise<void>
    updateCallbackDone: Promise<void>
  }
}

export function Navbar() {
  const [open, setOpen] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [user, setUser] = React.useState<User | null>(null)
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false)
  const [logoutLoading, setLogoutLoading] = React.useState(false)
  const reduce = useReducedMotion()
  const router = useRouter()
  
  const supabase = createClient()

  React.useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
    
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      try { if (localStorage.getItem('theme')) return } catch {}
      setIsDark(e.matches)
      document.documentElement.classList.toggle('dark', e.matches)
    }
    mq.addEventListener('change', onChange)

    return () => {
      authListener.subscription.unsubscribe()
      mq.removeEventListener('change', onChange)
    }
  }, [supabase])

  const toggleTheme = () => {
    const next = !isDark
    const apply = () => {
      setIsDark(next)
      document.documentElement.classList.toggle('dark', next)
      try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch {}
    }
    const doc = document as ViewTransitionDocument
    if (!doc.startViewTransition || reduce) { apply(); return }
    const transition = doc.startViewTransition(apply)
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'] },
          { duration: 800, easing: WIPE_EASE, pseudoElement: '::view-transition-new(root)' }
        )
      })
      .catch(() => {})
  }

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      await Promise.all([
        supabase.auth.signOut(),
        new Promise((resolve) => setTimeout(resolve, 600))
      ])
      setShowLogoutDialog(false)
      setOpen(false)
      toast.add({ type: 'success', title: 'Logged out successfully' })
      router.push('/')
      router.refresh()
    } catch (error) {
      setLogoutLoading(false)
      toast.add({ type: 'error', title: 'Error logging out' })
    }
  }

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.first_name || 'User'
  const initials = fullName.substring(0, 2).toUpperCase()
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  return (
    <>
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
        ::view-transition-old(root) { z-index: 0; }
        ::view-transition-new(root) { z-index: 1; }
      `}</style>

      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/60">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
          <nav aria-label="Primary" className="flex h-20 sm:h-24 items-center justify-between gap-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-2xl sm:text-3xl font-medium tracking-tight lowercase shrink-0"
            >
              nexlydevs
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              
              {mounted && (
                <Button
                  type="button"
                  onClick={toggleTheme}
                  variant="ghost"
                  size="icon"
                  aria-label={isDark ? 'Switch to light' : 'Switch to dark'}
                  className="h-11 w-11 rounded-full"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                      <motion.span
                        key="sun"
                        initial={reduce ? false : { rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <Sun className="h-4 w-4" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="moon"
                        initial={reduce ? false : { rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <Moon className="h-4 w-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              )}

              {/* Desktop Auth Links (Hidden on Mobile) */}
              {!user && (
                <div className="hidden lg:flex items-center gap-4">
                  <Link 
                    href="/login" 
                    className={buttonVariants({ variant: "ghost", className: "rounded-full h-10" })}
                  >
                    Log in
                  </Link>
                  <Link 
                    href="/signup" 
                    className={buttonVariants({ className: "rounded-full px-6 h-10" })}
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Profile Dropdown (Visible on Desktop AND Mobile if logged in) */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" className="relative h-11 w-11 rounded-full ml-1">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarImage src={avatarUrl} alt={fullName} />
                          <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                        </Avatar>
                      </Button>
                    }
                  />
                  <DropdownMenuContent 
                    className="w-56 duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2" 
                    align="end" 
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{fullName}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuGroup>
                      <DropdownMenuItem 
                        render={
                          <Link href="/duely" className="w-full cursor-pointer flex items-center justify-between">
                            <span>Duely Dashboard</span>
                            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                          </Link>
                        }
                      />
                      
                      <DropdownMenuItem 
                        render={
                          <Link href="/settings" className="w-full cursor-pointer flex items-center justify-between">
                            <span>Account Settings</span>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                          </Link>
                        }
                      />
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={() => setShowLogoutDialog(true)} 
                      className="text-destructive cursor-pointer flex items-center justify-between"
                    >
                      <span>Log out</span>
                      <LogOut className="h-4 w-4" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Hamburger Menu Button */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                className="group h-11 w-11 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors ml-1"
              >
                <span className="relative flex h-3 w-5 flex-col justify-between">
                  <motion.span
                    animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
                    className="block h-[1px] w-full bg-current origin-center"
                  />
                  <motion.span
                    animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
                    className="block h-[1px] w-full bg-current origin-center"
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {open && <MenuOverlay onClose={() => setOpen(false)} user={user} />}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutDialog(false)}
              className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="pointer-events-auto w-full max-w-[400px] rounded-2xl border border-border bg-card p-6 shadow-2xl relative"
              >
                <button 
                  onClick={() => setShowLogoutDialog(false)}
                  className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
                
                <div className="flex flex-col space-y-1.5 mb-6">
                  <h2 className="text-lg font-semibold leading-none tracking-tight">Log out</h2>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to log out of your account?
                  </p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button 
                    onClick={() => setShowLogoutDialog(false)} 
                    variant="outline" 
                    className="cursor-pointer rounded-full"
                    disabled={logoutLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleLogout} 
                    className="cursor-pointer rounded-full min-w-[120px]"
                    disabled={logoutLoading}
                  >
                    {logoutLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging out
                      </>
                    ) : (
                      'Log out'
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function MenuOverlay({ onClose, user }: { onClose: () => void, user: User | null }) {
  const reduce = useReducedMotion()
  const router = useRouter()

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    onClose()
    if (user) return 
    
    e.preventDefault()
    toast.add({
      type: 'warning',
      title: 'Sign in required',
      description: 'Please log in or sign up to view this page.',
      actionProps: {
        children: 'Log in',
        onClick: () => router.push('/login'),
      },
    })
  }

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { x: '100%' }}
      animate={reduce ? { opacity: 1 } : { x: 0 }}
      exit={reduce ? { opacity: 0 } : { x: '100%' }}
      transition={reduce ? { duration: 0.4, ease: EASE } : { duration: 0.9, ease: SLIDE_EASE }}
      className="fixed inset-0 z-40 overflow-y-auto bg-background"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto flex min-h-full max-w-[1600px] flex-col justify-between px-6 sm:px-10 lg:px-14 pb-10 pt-28">
        <ul className="flex flex-col">
          {NAV_ITEMS.map((item, i) => (
            <motion.li
              key={item.href}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.06, ease: EASE }}
              className="border-b border-border/60"
            >
              <Link
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                prefetch={false}
                className="group flex items-baseline gap-6 py-5"
              >
                <span className="font-mono text-[10px] text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-foreground/30 transition-colors duration-500 group-hover:text-foreground">
                  {item.label}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 group-hover:scale-x-100"
                  />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
          className="mt-10 flex flex-col gap-8"
        >
          {/* Show Login/Signup buttons in the mobile menu if logged out */}
          {!user && (
            <div className="flex flex-col gap-3 lg:hidden">
              <Link
                href="/login"
                onClick={onClose}
                className={buttonVariants({ variant: "outline", className: "rounded-full w-full h-12" })}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className={buttonVariants({ className: "rounded-full w-full h-12" })}
              >
                Sign up
              </Link>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-t border-border/60 pt-6">
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              A development studio building software for specific industries.
            </p>
            <ul className="flex gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="hover:text-foreground transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}