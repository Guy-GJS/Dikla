import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// SECURITY: This validates admin access before allowing ANY database operations
function validateAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  // Support both ADMIN_SECRET and NEXT_PUBLIC_ADMIN_SECRET for backward compatibility
  const validToken = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET || 'admin123'
  return authHeader === `Bearer ${validToken}`
}

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Reject unauthorized requests immediately
    if (!validateAdminAuth(request)) {
      console.warn('Unauthorized admin access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch orders using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, item:items(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

