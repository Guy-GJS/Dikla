import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// SECURITY: This validates admin access before allowing ANY database operations
function validateAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  // Support both ADMIN_SECRET and NEXT_PUBLIC_ADMIN_SECRET for backward compatibility
  const validToken = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET || 'admin123'
  
  // In production, this should validate a proper JWT or session token
  return authHeader === `Bearer ${validToken}`
}

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Reject unauthorized requests immediately
    if (!validateAdminAuth(request)) {
      console.warn('Unauthorized admin access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch items using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('items')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching items:', error)
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
    if (!validateAdminAuth(request)) {
      console.warn('Unauthorized admin access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { itemId, updates } = body

    if (!itemId || !updates) {
      return NextResponse.json({ error: 'Missing itemId or updates' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('items')
      .update(updates)
      .eq('id', itemId)
      .select()

    if (error) {
      console.error('Error updating item:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // SECURITY: Validate admin access
    if (!validateAdminAuth(request)) {
      console.warn('Unauthorized admin access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json({ error: 'Missing itemId' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('items')
      .delete()
      .eq('id', itemId)

    if (error) {
      console.error('Error deleting item:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

