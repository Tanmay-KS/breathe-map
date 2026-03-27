import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

const FALLBACK_CITY = {
  id: 'default-city',
  name: 'Default City',
  center_lat: 13.0827,
  center_lng: 80.2707,
  zoom: 12,
}

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('cities')
      .select('id, name, center_lat, center_lng, zoom')
      .order('name', { ascending: true })

    // Table missing or not migrated yet: keep app usable with one fallback city.
    if (error) {
      console.error('Error fetching cities:', error)
      return NextResponse.json({
        cities: [FALLBACK_CITY],
        count: 1,
        fallback: true,
        timestamp: new Date().toISOString(),
      })
    }

    const cities = data && data.length > 0 ? data : [FALLBACK_CITY]

    return NextResponse.json({
      cities,
      count: cities.length,
      fallback: !data || data.length === 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in cities route:', error)
    return NextResponse.json({
      cities: [FALLBACK_CITY],
      count: 1,
      fallback: true,
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch cities',
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const body = await request.json() as {
      name?: string
      state?: string
      country?: string
      center_lat?: number
      center_lng?: number
      zoom?: number
    }

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'City name is required' }, { status: 400 })
    }

    // Check for duplicate name
    const { data: existing } = await supabase
      .from('cities')
      .select('id')
      .ilike('name', body.name.trim())
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'A city with this name already exists' }, { status: 409 })
    }

    const insertData = {
      name: body.name.trim(),
      center_lat: body.center_lat ?? 0,
      center_lng: body.center_lng ?? 0,
      zoom: body.zoom ?? 12,
    }

    const { data, error } = await supabase
      .from('cities')
      .insert([insertData])
      .select('id, name, center_lat, center_lng, zoom')
      .single()

    if (error) {
      console.error('Error creating city:', error)
      return NextResponse.json({ error: 'Failed to create city', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ city: data }, { status: 201 })
  } catch (error) {
    console.error('Error in cities POST route:', error)
    return NextResponse.json({ error: 'Failed to create city' }, { status: 500 })
  }
}
