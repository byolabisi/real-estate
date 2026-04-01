'use client'

import { useState, useEffect } from 'react'
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
  state: string
  lga: string
  furnished: boolean
  created_at: string
  amenities?: string | null
  features?: string | null
  agent_id?: string
  parking_spots?: number | null
  currency?: string
  images_urls?: string | null
  status?: string
  updated_at?: string
}

// Mock data fallback - Comprehensive Lagos properties including affordable housing
const MOCK_LISTINGS: Listing[] = [
  // Premium - Lagos Island & Ikoyi
  { id: "mock-1", agent_id: "mock-agent-1", title: "Luxury 4-Bedroom Penthouse at Oniru Estate, Victoria Island", description: "Stunning high-rise penthouse with sweeping views of the Lagos lagoon.", house_type: "penthouse", rent_amount: 8500000, currency: "NGN", bedrooms: 4, bathrooms: 4, parking_spots: 3, furnished: true, state: "Lagos", lga: "Victoria Island", amenities: "Gym, Concierge, Rooftop lounge, 24/7 Security", features: "Smart home automation, Air conditioning", status: "active", created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-2", agent_id: "mock-agent-2", title: "Modern 3-Bedroom Apartment at Eko Atlantic City", description: "Contemporary apartment in prestigious Eko Atlantic development.", house_type: "apartment", rent_amount: 4500000, currency: "NGN", bedrooms: 3, bathrooms: 3, parking_spots: 2, furnished: true, state: "Lagos", lga: "Victoria Island", amenities: "Pool, Gym, Mall access, Beach", features: "Open plan living, Sea view", status: "active", created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-3", agent_id: "mock-agent-1", title: "Exclusive 5-Bedroom Mansion at Banana Island", description: "Ultra-luxury waterfront mansion with private jetty access.", house_type: "villa", rent_amount: 15000000, currency: "NGN", bedrooms: 5, bathrooms: 5, parking_spots: 4, furnished: true, state: "Lagos", lga: "Ikoyi", amenities: "Private jetty, Infinity pool, Spa, Cinema", features: "Waterfront property, Smart home", status: "active", created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
  // Mid-range - Mixed
  { id: "mock-4", agent_id: "mock-agent-3", title: "Sophisticated 3-Bedroom Flat in Ikoyi, near Awolowo Road", description: "Well-designed apartment in a secure building.", house_type: "flat", rent_amount: 2800000, currency: "NGN", bedrooms: 3, bathrooms: 2, parking_spots: 1, furnished: false, state: "Lagos", lga: "Ikoyi", amenities: "Generator, Water tank, CCTV, 24/7 Security", features: "Spacious rooms, Modern kitchen", status: "active", created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-5", agent_id: "mock-agent-2", title: "Stunning 4-Bedroom Duplex at Parkview Estate, Ikoyi", description: "Beautiful duplex in the secured Parkview Estate.", house_type: "duplex", rent_amount: 6500000, currency: "NGN", bedrooms: 4, bathrooms: 4, parking_spots: 2, furnished: true, state: "Lagos", lga: "Ikoyi", amenities: "Swimming pool, Garden, Gym, 24/7 Security", features: "Home office, Maids quarters", status: "active", created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-6", agent_id: "mock-agent-4", title: "Premium 2-Bedroom Apartment at Chevron Drive, Lekki", description: "Compact yet luxurious apartment ideal for professionals.", house_type: "apartment", rent_amount: 2200000, currency: "NGN", bedrooms: 2, bathrooms: 2, parking_spots: 1, furnished: true, state: "Lagos", lga: "Lekki", amenities: "Generator, CCTV, 24/7 Security, AC", features: "Modern finishes, Walk-in closet", status: "active", created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
  // Affordable Housing - Lagos Mainland
  { id: "mock-11", agent_id: "mock-agent-5", title: "Cozy Self-Contained Studio at Yaba, Near Unilag", description: "Perfect starter home. Fully furnished studio apartment close to Unilag campus.", house_type: "room", rent_amount: 450000, currency: "NGN", bedrooms: 0, bathrooms: 1, parking_spots: 0, furnished: true, state: "Lagos", lga: "Yaba", amenities: "Generator, Water supply, 24/7 Security", features: "Open plan living, Fitted kitchen", status: "active", created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-12", agent_id: "mock-agent-3", title: "Affordable 1-Bedroom Apartment in Surulere", description: "Budget-friendly 1-bedroom in the bustling Surulere community.", house_type: "apartment", rent_amount: 650000, currency: "NGN", bedrooms: 1, bathrooms: 1, parking_spots: 0, furnished: false, state: "Lagos", lga: "Surulere", amenities: "Generator access, Water supply, Community security", features: "Spacious room, Equipped kitchen", status: "active", created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-14", agent_id: "mock-agent-1", title: "Spacious 2-Bedroom Apartment in Yaba, Lagos", description: "Well-sized 2-bedroom close to universities, shops, and transport terminals.", house_type: "apartment", rent_amount: 1200000, currency: "NGN", bedrooms: 2, bathrooms: 1, parking_spots: 0, furnished: false, state: "Lagos", lga: "Yaba", amenities: "Generator, Water supply, 24/7 Security gates", features: "Spacious bedrooms, Fitted kitchen, Sitting area", status: "active", created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-15", agent_id: "mock-agent-2", title: "Affordable 2-Bedroom Flat in Ikeja GRA", description: "Comfortable 2-bedroom in the planned Ikeja GRA community.", house_type: "flat", rent_amount: 1450000, currency: "NGN", bedrooms: 2, bathrooms: 2, parking_spots: 0, furnished: false, state: "Lagos", lga: "Ikeja", amenities: "Generator access, Water supply, 24/7 Gate security", features: "Well-built rooms, Modern kitchen", status: "active", created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-16", agent_id: "mock-agent-3", title: "Modern 2-Bedroom Apartment at Alimosho, Lagos", description: "Recently renovated apartment in the growing Alimosho area.", house_type: "apartment", rent_amount: 950000, currency: "NGN", bedrooms: 2, bathrooms: 1, parking_spots: 0, furnished: false, state: "Lagos", lga: "Alimosho", amenities: "Water supply, Generator available, Community watch", features: "Newly painted, Good ventilation, Separate kitchen", status: "active", created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-18", agent_id: "mock-agent-1", title: "Comfortable 2-Bedroom Duplex at Bariga, Lagos Mainland", description: "Mid-terrace duplex in the bustling Bariga area with small yard.", house_type: "duplex", rent_amount: 1500000, currency: "NGN", bedrooms: 2, bathrooms: 2, parking_spots: 0, furnished: false, state: "Lagos", lga: "Bariga", amenities: "Water tank, Generator access, Yard space", features: "Good ventilation, Fitted kitchen, Spacious rooms", status: "active", created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
  { id: "mock-20", agent_id: "mock-agent-3", title: "Economy 1-Bedroom Apartment at Mushin, Lagos", description: "No-frills 1-bedroom in the lively Mushin neighborhood.", house_type: "apartment", rent_amount: 520000, currency: "NGN", bedrooms: 1, bathrooms: 1, parking_spots: 0, furnished: false, state: "Lagos", lga: "Mushin", amenities: "Water supply, Basic neighborhood watch", features: "Decent room size, Basic kitchen", status: "active", created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
]

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]

const HOUSE_TYPES = [
  'apartment', 'house', 'duplex', 'room', 'flat', 'bungalow', 'villa', 'penthouse'
]

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    state: '',
    houseType: '',
  })
  const [sortBy, setSortBy] = useState('newest')
  
  const supabase = createClient()

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      
      try {
        let query = supabase
          .from('listings')
          .select('*')
          .eq('status', 'active')

        if (filters.state) {
          query = query.eq('state', filters.state)
        }

        if (filters.houseType) {
          query = query.eq('house_type', filters.houseType)
        }

        const orderBy = sortBy === 'newest' ? 'desc' : 'asc'
        query = query.order('created_at', { ascending: orderBy === 'asc' })

        const { data, error } = await query

        if (error) {
          console.error('Error fetching listings:', error)
          // Use mock data as fallback
          let mockData = MOCK_LISTINGS
          if (filters.state) {
            mockData = mockData.filter(l => l.state === filters.state)
          }
          if (filters.houseType) {
            mockData = mockData.filter(l => l.house_type === filters.houseType)
          }
          setListings(mockData)
        } else {
          setListings(data || [])
        }
      } catch (err) {
        console.error('Error in fetchListings:', err)
        // Use mock data on any error
        let mockData = MOCK_LISTINGS
        if (filters.state) {
          mockData = mockData.filter(l => l.state === filters.state)
        }
        if (filters.houseType) {
          mockData = mockData.filter(l => l.house_type === filters.houseType)
        }
        setListings(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [filters, sortBy, supabase])

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
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
            <Button>Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 md:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Properties</h2>
        <p className="text-gray-600 mb-8">Find your perfect property across Nigeria</p>

        {/* Filters */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All States</option>
                {NIGERIAN_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={filters.houseType}
                onChange={(e) => handleFilterChange('houseType', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Types</option>
                {HOUSE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setFilters({ state: '', houseType: '' })}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading listings...</p>
            </div>
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
            <p className="text-lg text-gray-600">No listings found</p>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
                <Card className="cursor-pointer transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{listing.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ₦{listing.rent_amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">per month</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Type:</span> {listing.house_type}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {listing.lga}, {listing.state}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Furnished:</span> {listing.furnished ? 'Yes' : 'No'}
                      </p>
                    </div>

                    {listing.bedrooms && (
                      <div className="flex gap-4 pt-2 border-t border-gray-200">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{listing.bedrooms}</p>
                          <p className="text-xs text-gray-600">Bedrooms</p>
                        </div>
                        {listing.bathrooms && (
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">{listing.bathrooms}</p>
                            <p className="text-xs text-gray-600">Bathrooms</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
