'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/components/ui/toast'

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

function getAuthErrorMessage(error: { code?: string; message: string; status?: number }): string {
  const code = error.code ?? ''
  const msg = error.message.toLowerCase()
  
  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    return 'Incorrect email or password. If you originally signed up with Google or GitHub, click those buttons instead. To use a password, log in with Google/GitHub first, then set a password in your Account Settings.'
  }
  if (code === 'user_already_exists' || msg.includes('user already registered') || msg.includes('already registered')) {
    return 'An account with this email already exists. Redirecting you to login...'
  }
  if (code === 'weak_password' || msg.includes('password should be at least')) {
    return 'Password is too weak. Use at least 8 characters.'
  }
  if (code === 'over_request_rate_limit' || error.status === 429) {
    return 'Too many attempts. Please wait a few minutes.'
  }
  return 'Something went wrong. Please try again.'
}

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const isLogin = mode === 'login'
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const nextUrl = searchParams.get('next') || '/'

  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [oauthLoading, setOauthLoading] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) setError(decodeURIComponent(urlError))
  }, [searchParams])

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null)
    setOauthLoading(provider)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { 
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
          queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(getAuthErrorMessage(err))
      setOauthLoading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedEmail || !password) return setError('Please enter your email and password.')
    if (!isLogin && (!firstName.trim() || !lastName.trim())) return setError('Please enter your first and last name.')
    if (!isLogin && password.length < 8) return setError('Password must be at least 8 characters.')

    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password })
        if (error) throw error
        toast.add({ type: 'success', title: 'Welcome back!', description: 'Redirecting...' })
        router.push(nextUrl)
        router.refresh()
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: { data: { first_name: firstName.trim(), last_name: lastName.trim() } },
        })
        
        if (error?.message.includes('already registered') || (data?.user && !data?.session && !data?.user?.identities?.length)) {
           toast.add({ type: 'error', title: 'Account exists', description: 'Please log in instead.' })
           router.push('/login')
           return
        }
        if (error) throw error
        
        toast.add({ type: 'success', title: 'Account created!', description: 'Welcome to NexlyDevs.' })
        router.push(nextUrl)
        router.refresh()
      }
    } catch (err: any) {
      setError(getAuthErrorMessage(err))
      if (err?.message?.includes('already registered')) {
        setTimeout(() => router.push('/login'), 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
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
                {isLogin ? 'Enter your email below to login to your account' : 'Enter your details below to create your account'}
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.div variants={item} className="grid grid-cols-2 gap-2">
              <Button variant="outline" type="button" className="cursor-pointer rounded-full" disabled={loading || oauthLoading !== null} onClick={() => handleOAuth('github')}>
                {oauthLoading === 'github' ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitHubIcon />}
              </Button>
              <Button variant="outline" type="button" className="cursor-pointer rounded-full" disabled={loading || oauthLoading !== null} onClick={() => handleOAuth('google')}>
                {oauthLoading === 'google' ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
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
                <Input id="email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </motion.div>
              
              <motion.div variants={item} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground hover:underline cursor-pointer">Forgot password?</Link>
                  )}
                </div>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder={isLogin ? 'Enter your password' : 'At least 8 characters'} value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>

              {error && <motion.p variants={item} role="alert" className="text-sm font-medium text-destructive">{error}</motion.p>}

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
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Link href={isLogin ? '/signup' : '/login'} className="text-foreground font-medium hover:underline underline-offset-4 cursor-pointer">
                {isLogin ? 'Sign up' : 'Log in'}
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}