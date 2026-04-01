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
}

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
      } else {
        setListings(data || [])
      }
      
      setLoading(false)
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
