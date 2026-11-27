'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { Loader2, AlertTriangle, User, Lock, ShieldAlert } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'

type Tab = 'profile' | 'security' | 'danger'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [activeTab, setActiveTab] = React.useState<Tab>('profile')
  const [userEmail, setUserEmail] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isOAuthUser, setIsOAuthUser] = React.useState(false)

  // Profile State
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false)

  // Security State
  const [newPassword, setNewPassword] = React.useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false)

  // Delete State
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [confirmEmail, setConfirmEmail] = React.useState('')
  const [dialogOpen, setDialogOpen] = React.useState(false)

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setIsAuthenticated(true)
      setUserEmail(user.email || '')
      setFirstName(user.user_metadata?.first_name || '')
      setLastName(user.user_metadata?.last_name || '')
      
      // Check if the user signed up with OAuth (Google/GitHub)
      const hasEmailIdentity = user.identities?.some(identity => identity.provider === 'email')
      setIsOAuthUser(!hasEmailIdentity)

      setLoading(false)
    }
    getUser()
  }, [supabase, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)
    try {
      const newFullName = `${firstName.trim()} ${lastName.trim()}`.trim()

      const { error } = await supabase.auth.updateUser({
        data: { 
          first_name: firstName.trim(), 
          last_name: lastName.trim(),
          full_name: newFullName 
        }
      })
      if (error) throw error
      
      toast.add({ type: 'success', title: 'Profile updated successfully' })
      router.refresh() 
    } catch (err: any) {
      toast.add({ type: 'error', title: 'Error', description: err.message })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      return toast.add({ type: 'error', title: 'Password too short', description: 'Must be at least 8 characters.' })
    }
    setIsUpdatingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      
      toast.add({ type: 'success', title: 'Password updated successfully', description: 'You can now log in using this password.' })
      setNewPassword('')
    } catch (err: any) {
      console.error('Password update error:', err)
      toast.add({ type: 'error', title: 'Error updating password', description: err.message })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmEmail !== userEmail) return
    setIsDeleting(true)
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to delete account')
      
      toast.add({ type: 'success', title: 'Account deleted permanently' })
      router.push('/')
      router.refresh()
    } catch (err: any) {
      toast.add({ type: 'error', title: 'Error', description: err.message })
      setIsDeleting(false)
    }
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 md:py-12 px-4 md:px-8 mt-16 md:mt-20">
      <div className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-12">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-4 md:pb-0 md:sticky md:top-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <h2 className="hidden md:block text-xl font-semibold tracking-tight mb-4 px-3">Settings</h2>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 md:gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'profile' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <User className="h-4 w-4" /> Profile
            </button>
            
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 md:gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'security' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <Lock className="h-4 w-4" /> Security
            </button>

            <div className="hidden md:block pt-4 pb-2">
              <div className="h-px bg-border w-full" />
            </div>

            <button
              onClick={() => setActiveTab('danger')}
              className={`flex items-center gap-2 md:gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'danger' ? 'bg-destructive/10 text-destructive' : 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
              }`}
            >
              <ShieldAlert className="h-4 w-4" /> Danger Zone
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-2xl w-full">
          
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-xl font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">Update your personal information.</p>
              </div>
              <div className="h-px bg-border w-full" />
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={userEmail} disabled className="bg-muted max-w-md" />
                  <p className="text-[13px] text-muted-foreground">Your email address is used for login and cannot be changed here.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
                  </div>
                </div>
                <Button type="submit" disabled={isUpdatingProfile}>
                  {isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-xl font-medium">Security</h3>
                <p className="text-sm text-muted-foreground">Manage your password and security settings.</p>
              </div>
              <div className="h-px bg-border w-full" />
              
              {isOAuthUser && (
                <div className="bg-secondary/50 border border-border rounded-lg p-4 mb-6 text-sm text-muted-foreground flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-foreground" />
                  <p>
                    You originally signed up using Google or GitHub. You do not have a password set yet. Set a password below so you can also log in using your email address.
                  </p>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{isOAuthUser ? 'Create Password' : 'Change Password'}</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Enter new password" 
                  />
                  <p className="text-[13px] text-muted-foreground">Must be at least 8 characters long.</p>
                </div>
                <Button type="submit" disabled={isUpdatingPassword || !newPassword}>
                  {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isOAuthUser ? 'Set Password' : 'Update Password'}
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-xl font-medium text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">Irreversible and destructive actions.</p>
              </div>
              <div className="h-px bg-border w-full" />
              
              <div className="rounded-xl border border-destructive/30 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-destructive/5">
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">Delete Account</h4>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Permanently delete your account, data, and all active subscriptions. This action cannot be undone.
                  </p>
                </div>
                
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger 
                    render={
                      <Button variant="destructive" className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                        Delete Account
                      </Button>
                    }
                  />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Are you absolutely sure?
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <p className="text-sm text-muted-foreground">
                        Please type <strong className="text-foreground">{userEmail}</strong> to confirm.
                      </p>
                      <Input
                        placeholder={userEmail}
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                      />
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isDeleting} className="w-full sm:w-auto">
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={confirmEmail !== userEmail || isDeleting}
                        onClick={handleDeleteAccount}
                        className="w-full sm:w-auto"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          'Delete Account'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}