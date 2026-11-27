'use client'

import * as React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card'
import { toast } from '@/components/ui/toast'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedEmail) return setError('Please enter your email address.')

    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        // This is where Supabase sends the user after they click the email link.
        // Our callback route will exchange the code, then redirect to /reset-password
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })
      
      if (error) throw error
      
      setSuccess(true)
      toast.add({ 
        type: 'success', 
        title: 'Email sent', 
        description: 'If an account exists, a reset link is on its way.' 
      })
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 py-12 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-[400px]"
      >
        <Card className="shadow-lg border-border bg-card rounded-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {success ? 'Check your email' : 'Reset your password'}
            </CardTitle>
            <CardDescription>
              {success 
                ? 'We sent a password reset link to your email address.' 
                : 'Enter your email and we will send you a link to reset your password.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!success ? (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    autoComplete="email"
                  />
                </div>

                {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}

                <Button type="submit" className="w-full h-11 rounded-full cursor-pointer" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full h-11 rounded-full cursor-pointer"
                  onClick={() => setSuccess(false)}
                >
                  Try another email
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t border-border pt-6">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to log in
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}