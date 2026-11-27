import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  // 🚨 Safety net for Build Time
  if (!url || !key) {
    console.warn("⚠️ Supabase URL or Key is missing. Build-time auth disabled.");
    
    // Return a mock client during build time so Next.js doesn't crash
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
      },
    } as any
  }

  return createBrowserClient(url, key)
}