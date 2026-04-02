'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]

const USER_TYPES = [
  { value: 'agent', label: 'Real Estate Agent' },
  { value: 'landlord', label: 'Landlord/Property Owner' },
  { value: 'house_hunter', label: 'House Hunter' },
  { value: 'tenant', label: 'Tenant' },
]

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userType, setUserType] = useState('house_hunter')
  const [state, setState] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!state) {
      setError('Please select your state')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
            state,
          },
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-slate-900">Join Us Today</h1>
            <p className="text-slate-600">Create your account to access premium listings</p>
          </div>

          {/* Form Card */}
          <Card className="border border-slate-200 shadow-lg">
            <CardContent className="pt-8">
              <form onSubmit={handleSignUp}>
                <div className="space-y-4">
                  {/* First & Last Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="firstName" className="text-slate-700 font-medium text-sm">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-10 border-slate-200 focus:border-primary focus:ring-primary text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lastName" className="text-slate-700 font-medium text-sm">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-10 border-slate-200 focus:border-primary focus:ring-primary text-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 border-slate-200 focus:border-primary focus:ring-primary text-sm"
                    />
                  </div>

                  {/* User Type */}
                  <div className="space-y-1">
                    <Label htmlFor="userType" className="text-slate-700 font-medium text-sm">
                      I am a...
                    </Label>
                    <select
                      id="userType"
                      required
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {USER_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State */}
                  <div className="space-y-1">
                    <Label htmlFor="state" className="text-slate-700 font-medium text-sm">
                      State
                    </Label>
                    <select
                      id="state"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select your state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 border-slate-200 focus:border-primary focus:ring-primary text-sm"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <Label htmlFor="repeat-password" className="text-slate-700 font-medium text-sm">
                      Confirm Password
                    </Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="h-10 border-slate-200 focus:border-primary focus:ring-primary text-sm"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Sign Up Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>

                {/* Login Link */}
                <p className="mt-6 text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
