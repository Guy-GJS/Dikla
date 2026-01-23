import { NextRequest, NextResponse } from 'next/server'
import { createAdminToken, getAdminTokenTtlSeconds } from '@/lib/adminAuth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const adminSecret = process.env.ADMIN_SECRET

    if (!adminSecret) {
      return NextResponse.json(
        { error: 'ADMIN_SECRET is not set' },
        { status: 500 }
      )
    }

    if (!password || password !== adminSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = createAdminToken()
    const response = NextResponse.json({ token })

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: getAdminTokenTtlSeconds(),
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
