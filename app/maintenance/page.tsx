'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface MaintenanceNotice {
  id: string
  title: string
  description: string | null
  maintenance_type: string
  start_date: string
  expected_end_date: string | null
  status: string
  listings: {
    title: string
    state: string
    lga: string
  }
}

const MAINTENANCE_TYPES = [
  'plumbing', 'electrical', 'general', 'pest_control', 'painting', 'hvac', 'other'
]

export default function MaintenancePage() {
  const [notices, setNotices] = useState<MaintenanceNotice[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  
  const supabase = createClient()

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true)

      let query = supabase
        .from('maintenance_notices')
        .select('*, listings(title, state, lga)')
        .order('start_date', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching maintenance notices:', error)
      } else {
        setNotices(data || [])
      }

      setLoading(false)
    }

    fetchNotices()
  }, [filter, supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Notices</h2>
        <p className="text-gray-600 mb-8">Upcoming maintenance and repairs for properties</p>

        {/* Filter */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex gap-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-blue-600' : ''}
            >
              All
            </Button>
            <Button
              variant={filter === 'scheduled' ? 'default' : 'outline'}
              onClick={() => setFilter('scheduled')}
              className={filter === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
            >
              Scheduled
            </Button>
            <Button
              variant={filter === 'in_progress' ? 'default' : 'outline'}
              onClick={() => setFilter('in_progress')}
              className={filter === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : ''}
            >
              In Progress
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
              className={filter === 'completed' ? 'bg-green-100 text-green-800' : ''}
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Notices */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading maintenance notices...</p>
            </div>
          </div>
        ) : notices.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
            <p className="text-lg text-gray-600">No maintenance notices found</p>
            <p className="mt-2 text-sm text-gray-500">
              Check back later for updates
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => {
              const listing = notice.listings as any
              return (
                <Card key={notice.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {notice.title}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(notice.status)}`}>
                            {notice.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {listing && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Property:</span> {listing.title} • {listing.lga}, {listing.state}
                          </p>
                        )}

                        {notice.description && (
                          <p className="text-gray-600 mb-2">{notice.description}</p>
                        )}

                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>
                            <span className="font-medium">Type:</span> {notice.maintenance_type.replace(/_/g, ' ')}
                          </span>
                          <span>
                            <span className="font-medium">Start:</span> {formatDate(notice.start_date)}
                          </span>
                          {notice.expected_end_date && (
                            <span>
                              <span className="font-medium">Expected End:</span> {formatDate(notice.expected_end_date)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
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
