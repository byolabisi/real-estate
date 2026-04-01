'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface Listing {
  id: string
  title: string
  description: string | null
  house_type: string
  rent_amount: number
  bedrooms: number | null
  bathrooms: number | null
  parking_spots: number | null
  furnished: boolean
  state: string
  lga: string
  amenities: string | null
  features: string | null
  agent_id: string
  created_at: string
}

interface Agent {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  bio: string | null
}

interface AgentRating {
  rating: number
  comment: string | null
  created_at: string
}

export default function ListingDetailPage() {
  const params = useParams()
  const id = params?.id as string
  
  const [listing, setListing] = useState<Listing | null>(null)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [ratings, setRatings] = useState<AgentRating[]>([])
  const [loading, setLoading] = useState(true)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    if (!id) return

    const fetchListing = async () => {
      setLoading(true)
      
      // Fetch listing
      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single()

      if (listingError || !listingData) {
        console.error('Error fetching listing:', listingError)
        setLoading(false)
        return
      }

      setListing(listingData)

      // Fetch agent details
      const { data: agentData, error: agentError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, phone, bio')
        .eq('id', listingData.agent_id)
        .single()

      if (!agentError && agentData) {
        setAgent(agentData)

        // Fetch agent ratings
        const { data: ratingsData } = await supabase
          .from('agent_ratings')
          .select('rating, comment, created_at')
          .eq('agent_id', agentData.id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (ratingsData) {
          setRatings(ratingsData)
        }
      }

      setLoading(false)
    }

    fetchListing()
  }, [id, supabase])

  const handleContactAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendingMessage(true)

    try {
      // In a real app, this would send an email
      console.log('Contacting agent:', contactMessage)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setContactMessage('')
      setShowContactForm(false)
      alert('Message sent! The agent will contact you shortly.')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Listing not found</h1>
          <Link href="/listings" className="mt-4 inline-block">
            <Button>Back to Listings</Button>
          </Link>
        </div>
      </div>
    )
  }

  const agentName = agent
    ? `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || agent.email
    : 'Unknown Agent'

  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 'N/A'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4 md:px-8">
          <Link href="/">
            <h1 className="text-2xl font-bold text-gray-900 cursor-pointer">PropertiesNG</h1>
          </Link>
          <Link href="/listings">
            <Button variant="outline">Back to Listings</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8 md:px-8">
        {/* Property Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{listing.title}</h1>
          <p className="mt-2 text-gray-600">
            {listing.lga}, {listing.state}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Property Image Placeholder */}
            <Card>
              <CardContent className="pt-6">
                <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-600">Property images would display here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price */}
            <Card>
              <CardHeader>
                <CardTitle>Rental Price</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-gray-900">
                  ₦{listing.rent_amount.toLocaleString()}
                </p>
                <p className="mt-2 text-gray-600">per month</p>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Property Type</p>
                    <p className="mt-1 text-gray-900">
                      {listing.house_type.charAt(0).toUpperCase() + listing.house_type.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Furnished</p>
                    <p className="mt-1 text-gray-900">{listing.furnished ? 'Yes' : 'No'}</p>
                  </div>
                  {listing.bedrooms && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bedrooms</p>
                      <p className="mt-1 text-gray-900">{listing.bedrooms}</p>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bathrooms</p>
                      <p className="mt-1 text-gray-900">{listing.bathrooms}</p>
                    </div>
                  )}
                  {listing.parking_spots && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Parking Spots</p>
                      <p className="mt-1 text-gray-900">{listing.parking_spots}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {listing.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-600">{listing.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {listing.amenities && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {listing.amenities.split(',').map((amenity, idx) => (
                      <span
                        key={idx}
                        className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                      >
                        {amenity.trim()}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            {agent && (
              <Card>
                <CardHeader>
                  <CardTitle>Listed by</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">{agentName}</p>
                    {agent.email && (
                      <p className="text-sm text-gray-600">{agent.email}</p>
                    )}
                  </div>

                  {/* Agent Rating */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {ratings.length} rating{ratings.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Agent Bio */}
                  {agent.bio && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600">{agent.bio}</p>
                    </div>
                  )}

                  {/* Contact Button */}
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowContactForm(!showContactForm)}
                  >
                    {showContactForm ? 'Cancel' : 'Contact Agent'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Contact Form */}
            {showContactForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactAgent} className="space-y-4">
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      rows={4}
                      required
                    />
                    <Button
                      type="submit"
                      disabled={sendingMessage}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {sendingMessage ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            {ratings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ratings.map((rating, idx) => (
                    <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: rating.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                      {rating.comment && (
                        <p className="mt-2 text-sm text-gray-600">{rating.comment}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
