import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      item_id,
      buyer_first_name,
      buyer_last_name,
      buyer_email,
      buyer_phone,
      type,
      subtotal,
      pritti_fee,
      shipping_fee,
      total,
    } = body

    // Validate required fields
    if (!item_id || !buyer_first_name || !buyer_last_name || !buyer_email || !buyer_phone || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate order type
    if (type !== 'delivery' && type !== 'pickup') {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      )
    }

    // Verify item exists and is available
    const { data: item, error: itemError } = await supabaseAdmin
      .from('items')
      .select('id, status')
      .eq('id', item_id)
      .eq('status', 'approved')
      .single()

    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Item not found or not available' },
        { status: 404 }
      )
    }

    // Create order using admin client (bypasses RLS)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        item_id,
        buyer_first_name,
        buyer_last_name,
        buyer_email,
        buyer_phone,
        type,
        subtotal,
        pritti_fee,
        shipping_fee,
        total,
        status: 'initiated',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error: any) {
    console.error('Order API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

