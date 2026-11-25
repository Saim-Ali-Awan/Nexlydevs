'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Eye, EyeOff, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'

// --- Icons ---
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57a10.8 10.8 0 0 0 3.32-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.67.41.35.77 1.04.77 2.1v3.11c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const isLogin = mode === 'login'
  const router = useRouter()
  const supabase = createClient()

  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  
  const [loading, setLoading] = React.useState(false)
  const [oauthLoading, setOauthLoading] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [showDialog, setShowDialog] = React.useState(false)

  const handleOAuth = async (provider: 'google' | 'github' | 'apple') => {
    setError(null)
    setOauthLoading(provider)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err?.message ?? `Could not connect to ${provider}.`)
      setOauthLoading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLogin) {
      if (!email || !password) { setError('Please enter your email and password.'); return }
    } else {
      if (!firstName || !lastName || !email || !password) { setError('Please fill in all fields.'); return }
      if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    }

    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setShowDialog(true) 
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { first_name: firstName, last_name: lastName }
          }
        })
        if (error) throw error
        
        if (data?.user && !data.session) {
          toast.add({ 
            type: 'success', 
            title: 'Check your email', 
            description: 'We sent you a link to verify your account.' 
          })
        } else if (data.session) {
          setShowDialog(true)
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err)
      setError(err?.message ?? 'An error occurred during authentication.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoToDuely = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const hasDuelyAccess = user?.user_metadata?.hasDuelyAccess === true

    if (hasDuelyAccess) {
      router.push('/duely') 
    } else {
      toast.add({
        type: 'error',
        title: 'Subscription Required',
        description: 'You need to subscribe to Duely to access the dashboard.',
      })
      router.push('/pricing')
    }
  }

  return (
    <>
      <div className="flex min-h-[100dvh] items-center justify-center px-4 py-12 bg-background">
        <motion.div initial="hidden" animate="visible" variants={container} className="w-full max-w-[400px]">
          <Card className="shadow-lg border-border bg-card rounded-2xl">
            <CardHeader className="space-y-1 text-center">
              <motion.div variants={item}>
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  {isLogin ? 'Welcome back' : 'Create an account'}
                </CardTitle>
              </motion.div>
              <motion.div variants={item} className="space-y-2">
                <CardDescription>
                  {isLogin 
                    ? 'Enter your email below to login to your account' 
                    : 'Enter your details below to create your account'}
                </CardDescription>
                <p className="text-[13px] font-medium text-foreground">
                  One login for every app.
                </p>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-4">
              
              <motion.div variants={item} className="grid grid-cols-3 gap-2">
                <Button variant="outline" type="button" className="cursor-pointer rounded-full" disabled={loading || oauthLoading !== null} onClick={() => handleOAuth('github')}>
                  {oauthLoading === 'github' ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitHubIcon />}
                </Button>
                <Button variant="outline" type="button" className="cursor-pointer rounded-full" disabled={loading || oauthLoading !== null} onClick={() => handleOAuth('google')}>
                  {oauthLoading === 'google' ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
                </Button>
                <Button variant="outline" type="button" className="cursor-pointer rounded-full" disabled={loading || oauthLoading !== null} onClick={() => handleOAuth('apple')}>
                  {oauthLoading === 'apple' ? <Loader2 className="h-4 w-4 animate-spin" /> : <AppleIcon />}
                </Button>
              </motion.div>

              <motion.div variants={item} className="relative mt-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </motion.div>

              <form noValidate onSubmit={handleSubmit} className="space-y-4 mt-4">
                {!isLogin && (
                  <motion.div variants={item} className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </motion.div>
                )}

                <motion.div variants={item} className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </motion.div>
                
                <motion.div variants={item} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {isLogin && (
                      <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground hover:underline cursor-pointer">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    {/* 🚨 Removed dummy dots, added text placeholder */}
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>

                {error && <motion.p variants={item} className="text-sm font-medium text-destructive">{error}</motion.p>}

                <motion.div variants={item}>
                  <Button type="submit" className="w-full cursor-pointer h-11 rounded-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLogin ? 'Sign In' : 'Sign Up'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground pt-4 border-t border-border">
              <motion.div variants={item}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Link href={isLogin ? '/signup' : '/login'} className="text-foreground font-medium hover:underline underline-offset-4 cursor-pointer">
                  {isLogin ? 'Sign up' : 'Log in'}
                </Link>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* 🚨 Welcome Dialog with rounded-2xl */}
      <AnimatePresence>
        {showDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDialog(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="pointer-events-auto w-full max-w-[425px] rounded-2xl border border-border bg-card p-6 shadow-2xl relative"
              >
                <button 
                  onClick={() => setShowDialog(false)}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
                
                <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
                  <h2 className="text-lg font-semibold leading-none tracking-tight">Welcome!</h2>
                  <p className="text-sm text-muted-foreground">
                    Where would you like to go next? Your account is connected to our software.
                  </p>
                </div>
                
                <div className="grid gap-4 py-4">
                  <Button onClick={() => router.push('/')} variant="outline" className="w-full h-12 cursor-pointer rounded-full">
                    View Website
                  </Button>
                  <Button onClick={handleGoToDuely} className="w-full h-12 cursor-pointer rounded-full">
                    Open Duely Dashboard
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