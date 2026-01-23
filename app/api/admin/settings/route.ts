import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateAdminRequest } from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Reject unauthorized requests immediately
    if (!validateAdminRequest(request)) {
      console.warn('Unauthorized admin access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all settings using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('*')

    if (error) {
      console.error('Error fetching settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // SECURITY: Validate admin access
    if (!validateAdminRequest(request)) {
      console.warn('Unauthorized admin access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { key, value } = body

    console.log('[API /api/admin/settings PATCH] Saving setting:', { key, value: JSON.stringify(value) })

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Missing key or value' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() })
      .select()

    if (error) {
      console.error('[API /api/admin/settings PATCH] Error updating setting:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[API /api/admin/settings PATCH] Successfully saved:', data)

    return NextResponse.json({ data })
  } catch (error) {
    console.error('[API /api/admin/settings PATCH] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

