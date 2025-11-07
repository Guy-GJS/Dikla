import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Disable caching for this endpoint
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    console.log('[API /api/settings] Fetching settings from database...')
    
    // Fetch public settings (commission config and shipping)
    // Use supabaseAdmin to bypass RLS and avoid recursion issues
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('*')
      .in('key', ['commission_config', 'pritti_default_shipping'])

    if (error) {
      console.error('[API /api/settings] Error fetching settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[API /api/settings] Raw data from database:', JSON.stringify(data, null, 2))

    // Transform array to object for easier access
    const settingsObj: Record<string, any> = {}
    data.forEach(setting => {
      settingsObj[setting.key] = setting.value
    })

    console.log('[API /api/settings] Transformed settings:', JSON.stringify(settingsObj, null, 2))

    // Return with no-cache headers
    return NextResponse.json(
      { data: settingsObj },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('[API /api/settings] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

