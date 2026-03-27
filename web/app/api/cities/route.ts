import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

const FALLBACK_CITY = {
  id: 'default-city',
  name: 'Default City',
  center_lat: 13.0827,
  center_lng: 80.2707,
  zoom: 12,
}

function normalizeCity(city: {
  id: string
  name: string
  center_lat: number | string
  center_lng: number | string
  zoom: number | string
}) {
  return {
    id: city.id,
    name: city.name,
    center_lat: Number(city.center_lat),
    center_lng: Number(city.center_lng),
    zoom: Number(city.zoom),
  }
}

function slugifyCityName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
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

    const cities = data && data.length > 0 ? data.map(normalizeCity) : [FALLBACK_CITY]

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

    const cityName = body.name?.trim()
    const centerLat = Number(body.center_lat)
    const centerLng = Number(body.center_lng)
    const zoom = Number(body.zoom ?? 12)

    if (!cityName) {
      return NextResponse.json({ error: 'City name is required', code: 'CITY_CREATE_INVALID' }, { status: 400 })
    }

    if (!Number.isFinite(centerLat) || centerLat < -90 || centerLat > 90) {
      return NextResponse.json({ error: 'center_lat must be between -90 and 90', code: 'CITY_CREATE_INVALID' }, { status: 400 })
    }

    if (!Number.isFinite(centerLng) || centerLng < -180 || centerLng > 180) {
      return NextResponse.json({ error: 'center_lng must be between -180 and 180', code: 'CITY_CREATE_INVALID' }, { status: 400 })
    }

    if (!Number.isInteger(zoom) || zoom < 1 || zoom > 20) {
      return NextResponse.json({ error: 'zoom must be an integer between 1 and 20', code: 'CITY_CREATE_INVALID' }, { status: 400 })
    }

    // Check for duplicate name
    const { data: existing } = await supabase
      .from('cities')
      .select('id')
      .ilike('name', cityName)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'A city with this name already exists', code: 'CITY_CREATE_DUPLICATE' }, { status: 409 })
    }

    const baseId = slugifyCityName(cityName)
    if (!baseId) {
      return NextResponse.json({ error: 'Unable to generate city id', code: 'CITY_CREATE_INVALID' }, { status: 400 })
    }

    let cityId = baseId
    const { data: conflictingIds, error: conflictError } = await supabase
      .from('cities')
      .select('id')
      .ilike('id', `${baseId}%`)

    if (conflictError) {
      console.error('Error checking city id conflicts:', conflictError)
      return NextResponse.json({ error: 'Failed to validate city id', details: conflictError.message }, { status: 500 })
    }

    const takenIds = new Set((conflictingIds ?? []).map((row) => row.id))
    if (takenIds.has(cityId)) {
      let suffix = 2
      while (takenIds.has(`${baseId}-${suffix}`)) suffix += 1
      cityId = `${baseId}-${suffix}`
    }

    const insertData = {
      id: cityId,
      name: cityName,
      center_lat: Number(centerLat.toFixed(6)),
      center_lng: Number(centerLng.toFixed(6)),
      zoom,
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

    return NextResponse.json({ city: normalizeCity(data) }, { status: 201 })
  } catch (error) {
    console.error('Error in cities POST route:', error)
    return NextResponse.json({ error: 'Failed to create city' }, { status: 500 })
  }
}
