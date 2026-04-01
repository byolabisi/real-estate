'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface Listing {
  id: string
  title: string
  state: string
  lga: string
}

export default function CreateReviewPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    listingId: '',
    rating: 5,
    title: '',
    comment: '',
    conditionRating: 5,
    landlordRating: 5,
    neighborhoodRating: 5,
  })

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const userType = user.user_metadata?.user_type
      if (userType !== 'tenant') {
        router.push('/dashboard')
        return
      }

      setUserId(user.id)

      // Fetch tenant's rental history
      const { data: historyData } = await supabase
        .from('tenant_history')
        .select('listing_id, listings(id, title, state, lga)')
        .eq('tenant_id', user.id)
        .eq('is_current', false) // Only show past rentals

      if (historyData) {
        const uniqueListings = Array.from(
          new Map(
            historyData.map(h => [
              (h.listings as any)?.id,
              h.listings as any
            ])
          ).values()
        ).filter(l => l !== undefined && l !== null)
        
        setListings(uniqueListings)
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (!userId || !formData.listingId) {
        setError('Please select a property')
        return
      }

      const { error: insertError } = await supabase
        .from('tenant_reviews')
        .insert([
          {
            listing_id: formData.listingId,
            reviewer_id: userId,
            rating: formData.rating,
            title: formData.title,
            comment: formData.comment,
            condition_rating: formData.conditionRating,
            landlord_rating: formData.landlordRating,
            neighborhood_rating: formData.neighborhoodRating,
          }
        ])

      if (insertError) {
        setError(insertError.message)
        return
      }

      router.push('/reviews/my-reviews')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || userId === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4 md:px-8">
          <Link href="/">
            <h1 className="text-2xl font-bold text-gray-900 cursor-pointer">PropertiesNG</h1>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8 md:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Write a Property Review</CardTitle>
            <p className="text-sm text-gray-600 mt-2">Share your experience with this property to help others</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-800 text-sm">
                  {error}
                </div>
              )}

              {listings.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 py-8 text-center">
                  <p className="text-gray-600">You haven&apos;t rented any properties yet</p>
                  <p className="mt-2 text-sm text-gray-500">
                    You can only review properties you&apos;ve lived in
                  </p>
                </div>
              ) : (
                <>
                  {/* Select Property */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Property *
                    </label>
                    <select
                      name="listingId"
                      value={formData.listingId}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Choose a property</option>
                      {listings.map(listing => (
                        <option key={listing.id} value={listing.id}>
                          {listing.title} - {listing.lga}, {listing.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Overall Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Overall Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                          className="text-3xl transition-colors"
                        >
                          <span className={formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Great apartment, friendly landlord"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Review *
                    </label>
                    <textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      placeholder="Tell others about your experience with this property..."
                      rows={4}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Category Ratings */}
                  <div className="space-y-4 border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900">Rate Specific Aspects</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Condition
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, conditionRating: star }))}
                            className="text-2xl transition-colors"
                          >
                            <span className={formData.conditionRating >= star ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Landlord/Agent Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, landlordRating: star }))}
                            className="text-2xl transition-colors"
                          >
                            <span className={formData.landlordRating >= star ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Neighborhood
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, neighborhoodRating: star }))}
                            className="text-2xl transition-colors"
                          >
                            <span className={formData.neighborhoodRating >= star ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <Link href="/dashboard" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
