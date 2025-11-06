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

    // Fetch categories using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Validate admin access
    if (!validateAdminAuth(request)) {
      console.warn('Unauthorized admin access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, image_url, is_featured, sort_order } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Missing required fields: name and slug' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({
        name,
        slug,
        image_url: image_url || null,
        is_featured: is_featured || false,
        sort_order: sort_order || 0,
      })
      .select()

    if (error) {
      console.error('Error creating category:', error)
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
    const { categoryId, updates } = body

    if (!categoryId || !updates) {
      return NextResponse.json({ error: 'Missing categoryId or updates' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updates)
      .eq('id', categoryId)
      .select()

    if (error) {
      console.error('Error updating category:', error)
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
    const categoryId = searchParams.get('categoryId')

    if (!categoryId) {
      return NextResponse.json({ error: 'Missing categoryId' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) {
      console.error('Error deleting category:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

