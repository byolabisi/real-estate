'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface Agent {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  state: string | null
  lga: string | null
  bio: string | null
  average_rating: number
  review_count: number
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState('')
  
  const supabase = createClient()

  const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
    'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ]

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true)

      // Fetch all agents
      let query = supabase
        .from('users')
        .select('id, first_name, last_name, email, state, lga, bio')
        .in('user_type', ['agent', 'landlord'])

      if (state) {
        query = query.eq('state', state)
      }

      const { data: agentsData, error } = await query

      if (error || !agentsData) {
        console.error('Error fetching agents:', error)
        setLoading(false)
        return
      }

      // Fetch ratings for each agent
      const agentsWithRatings = await Promise.all(
        agentsData.map(async (agent) => {
          const { data: ratings } = await supabase
            .from('agent_ratings')
            .select('rating')
            .eq('agent_id', agent.id)

          const reviewCount = ratings?.length || 0
          const averageRating = reviewCount > 0
            ? ratings!.reduce((sum, r) => sum + r.rating, 0) / reviewCount
            : 0

          return {
            ...agent,
            average_rating: parseFloat(averageRating.toFixed(1)),
            review_count: reviewCount
          }
        })
      )

      // Sort by rating descending
      agentsWithRatings.sort((a, b) => b.average_rating - a.average_rating)
      setAgents(agentsWithRatings)
      setLoading(false)
    }

    fetchAgents()
  }, [state, supabase])

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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Agents</h2>
        <p className="text-gray-600 mb-8">Connect with top-rated agents and landlords across Nigeria</p>

        {/* Filter */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All States</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            {state && (
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setState('')}
                >
                  Clear Filter
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Agents Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading agents...</p>
            </div>
          </div>
        ) : agents.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
            <p className="text-lg text-gray-600">No agents found</p>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => {
              const name = `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || agent.email
              return (
                <Card key={agent.id}>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {agent.average_rating}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-yellow-400">★</span>
                        <span className="text-xs text-gray-600">
                          {agent.review_count} review{agent.review_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    {(agent.state || agent.lga) && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {agent.lga && `${agent.lga}, `}{agent.state}
                      </p>
                    )}

                    {/* Bio */}
                    {agent.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2">{agent.bio}</p>
                    )}

                    {/* Email */}
                    {agent.email && (
                      <p className="text-sm text-gray-600 break-all">
                        <span className="font-medium">Email:</span> {agent.email}
                      </p>
                    )}

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Listings
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
