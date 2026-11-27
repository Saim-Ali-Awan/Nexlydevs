// app/login/page.tsx
import { Suspense } from 'react'
import { AuthForm } from '@/components/auth-form'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-background" />}>
      <AuthForm mode="signup" />
    </Suspense>
  )
}