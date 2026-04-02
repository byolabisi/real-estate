'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const FEATURED_LISTINGS = [
  { id: 1, type: 'Luxury Penthouse', price: '₦8,500,000/yr', location: 'Victoria Island', bedrooms: 4, image: '/building-2.jpg', rating: 4.9 },
  { id: 2, type: 'Modern Apartment', price: '₦4,500,000/yr', location: 'Eko Atlantic', bedrooms: 3, image: '/building-1.jpg', rating: 4.8 },
  { id: 3, type: 'Exclusive Villa', price: '₦15,000,000/yr', location: 'Banana Island', bedrooms: 5, image: '/building-3.jpg', rating: 4.9 },
]

export default function Home() {
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistUserType, setWaitlistUserType] = useState('house_hunter')
  const [waitlistState, setWaitlistState] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
    'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ]

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: waitlistEmail,
          userType: waitlistUserType,
          state: waitlistState,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setMessage('✓ Welcome! Check your email for the next steps.')
        setWaitlistEmail('')
      } else {
        setMessage('Error: ' + (data.error || 'Failed to join waitlist'))
      }
    } catch (error) {
      setMessage('Error: Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-8">
          <div className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
            PropertiesNG
          </div>
          <div className="hidden md:flex gap-8">
            <Link href="/listings" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Browse</Link>
            <a href="#why-us" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Why Us</a>
            <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Contact</a>
          </div>
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button variant="outline" className="border-slate-200">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-amber-700 hover:bg-amber-800 text-white">Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section with Full Width Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/building-1.jpg" 
            alt="Luxury residential building" 
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Your Perfect Home in Lagos
            </h1>
            <p className="text-xl text-slate-100 mb-10 max-w-xl">
              Discover verified luxury properties across Lagos Island, Ikoyi, and beyond. Transparent pricing, trusted agents, and community reviews.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-xl">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Property type..."
                    className="px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                  <select className="px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-700">
                    <option>All States</option>
                    {NIGERIAN_STATES.slice(0, 10).map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Link href="/listings" className="block w-full">
                  <Button className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 text-base font-semibold rounded-lg">
                    Search Properties
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section id="listings" className="border-t border-slate-200 bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900">Featured Properties</h2>
              <p className="text-slate-600 mt-2">Handpicked listings across Nigeria</p>
            </div>
            <Link href="/listings">
              <Button className="bg-amber-700 hover:bg-amber-800 text-white">View All</Button>
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {FEATURED_LISTINGS.map((listing) => (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
                <Card className="h-full hover:shadow-2xl transition-all overflow-hidden border-0 hover:scale-105">
                  <CardContent className="p-0">
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden bg-slate-200">
                      <img 
                        src={listing.image} 
                        alt={listing.type}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 text-sm font-semibold text-amber-700 shadow-lg">
                        {listing.bedrooms} bd
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">{listing.type}</p>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{listing.type}</h3>
                      <p className="text-3xl font-bold text-amber-700 mb-4">{listing.price}</p>
                      <p className="text-slate-600 text-sm mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {listing.location}
                      </p>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-amber-700">★{listing.rating}</span>
                        <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="border-t border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-4">Why Choose PropertiesNG?</h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">Everything you need for transparent, secure real estate transactions</p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Verified Listings</h3>
              <p className="text-slate-600 text-sm">All properties verified for authenticity with real agent details and photos.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Transparent Pricing</h3>
              <p className="text-slate-600 text-sm">No hidden fees. All amounts clearly displayed with detailed breakdowns.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Data Protection</h3>
              <p className="text-slate-600 text-sm">Privacy first. Addresses hidden until verified contact is initiated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section id="contact" className="border-t border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50 py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-slate-900">Get Exclusive Early Access</h2>
            <p className="text-slate-600 mt-3">
              Join our waitlist for verified listings, community reviews, and transparent pricing.
            </p>
          </div>

          <form onSubmit={handleWaitlist} className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Your email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={waitlistUserType}
                  onChange={(e) => setWaitlistUserType(e.target.value)}
                  className="rounded-lg border border-slate-200 px-4 py-3 text-slate-900 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                >
                  <option value="house_hunter">House Hunter</option>
                  <option value="agent">Real Estate Agent</option>
                  <option value="landlord">Landlord/Property Owner</option>
                  <option value="tenant">Tenant</option>
                </select>
                <select
                  value={waitlistState}
                  onChange={(e) => setWaitlistState(e.target.value)}
                  required
                  className="rounded-lg border border-slate-200 px-4 py-3 text-slate-900 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                >
                  <option value="">Select your state</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {message && (
                <p className={`text-sm text-center ${message.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 font-semibold"
              >
                {loading ? 'Joining...' : 'Join Waitlist'}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">PropertiesNG</div>
              <p className="mt-2 text-sm text-slate-400">Nigeria&apos;s trusted real estate platform connecting agents, landlords & house hunters.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">For Buyers</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/listings" className="hover:text-white transition">Browse Listings</Link></li>
                <li><Link href="/listings" className="hover:text-white transition">Search Properties</Link></li>
                <li><Link href="/reviews/create" className="hover:text-white transition">Leave Reviews</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">For Agents</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/listings/create" className="hover:text-white transition">List Property</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                <li><Link href="/agents" className="hover:text-white transition">Find Agents</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-white transition text-opacity-50 cursor-not-allowed">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition text-opacity-50 cursor-not-allowed">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition text-opacity-50 cursor-not-allowed">Data Protection</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 PropertiesNG. All rights reserved. | Connecting Nigeria&apos;s Real Estate Community</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
