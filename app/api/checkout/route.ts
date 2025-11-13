import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const orderId = searchParams.get('orderId')

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
  }

  try {
    // Fetch order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*, item:items(*)')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'ils',
            product_data: {
              name: order.item.title,
              description: order.item.description || undefined,
            },
            unit_amount: Math.round(order.total * 100), // Convert to agorot
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order_id=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/item/${order.item.id}`,
      metadata: {
        order_id: orderId,
      },
    })

    // Update order with payment intent ID
    await supabaseAdmin
      .from('orders')
      .update({ stripe_payment_intent_id: session.id })
      .eq('id', orderId)

    // Redirect to Stripe Checkout
    return NextResponse.redirect(session.url!)
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}


