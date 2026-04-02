'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface User {
  id: string
  email: string | null
  user_type: string
  first_name: string | null
  last_name: string | null
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push('/auth/login')
        return
      }

      setUser({
        id: authUser.id,
        email: authUser.email,
        user_type: authUser.user_metadata?.user_type || 'house_hunter',
        first_name: authUser.user_metadata?.first_name,
        last_name: authUser.user_metadata?.last_name,
      })
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isAgent = user.user_type === 'agent' || user.user_type === 'landlord'
  const userName = user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.email

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4 md:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PropertiesNG</h1>
            <p className="mt-1 text-sm text-gray-600">Welcome back, {userName}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="outline">Profile</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-8">
        {/* Welcome Card */}
        <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <p className="text-lg text-gray-900">
              Hi {user.first_name || 'there'}! Welcome to PropertiesNG.
            </p>
            <p className="mt-2 text-gray-600">
              You are logged in as a <strong>{user.user_type.replace('_', ' ')}</strong>
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {isAgent && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">List a New Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">
                    Add a new property to your portfolio in just a few minutes.
                  </p>
                  <Link href="/listings/create">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Create Listing
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">
                    View and manage all your active properties.
                  </p>
                  <Link href="/listings/my-listings">
                    <Button variant="outline" className="w-full">
                      View My Listings
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          {user.user_type === 'house_hunter' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Browse Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">
                    Search and filter properties by location, price, and features.
                  </p>
                  <Link href="/listings">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Browse Listings
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Saved Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">
                    View properties you&apos;ve saved for later.
                  </p>
                  <Link href="/favorites">
                    <Button variant="outline" className="w-full">
                      View Saved
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          {user.user_type === 'tenant' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rate Your Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">
                    Share your experience living in a property.
                  </p>
                  <Link href="/reviews/create">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Write Review
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">
                    View reviews you&apos;ve written.
                  </p>
                  <Link href="/reviews/my-reviews">
                    <Button variant="outline" className="w-full">
                      View My Reviews
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* General Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Browse All Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600">
                Explore verified properties across Nigeria.
              </p>
              <Link href="/listings">
                <Button variant="outline" className="w-full">
                  View Listings
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agent Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600">
                Find top-rated agents in your area.
              </p>
              <Link href="/agents">
                <Button variant="outline" className="w-full">
                  Find Agents
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Help & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600">
                Get help with your account or properties.
              </p>
              <Link href="/support">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
