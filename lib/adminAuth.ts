import crypto from 'crypto'
import { NextRequest } from 'next/server'

const TOKEN_TTL_SECONDS = 60 * 60 * 12

function getAdminSecret() {
  return process.env.ADMIN_SECRET || ''
}

export function createAdminToken() {
  const secret = getAdminSecret()
  if (!secret) {
    throw new Error('ADMIN_SECRET is not set')
  }

  const issuedAt = Math.floor(Date.now() / 1000)
  const nonce = crypto.randomBytes(16).toString('hex')
  const payload = `${nonce}.${issuedAt}`
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return `${payload}.${signature}`
}

export function validateAdminToken(token: string) {
  const secret = getAdminSecret()
  if (!secret) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false

  const [nonce, issuedAtRaw, signature] = parts
  const issuedAt = Number(issuedAtRaw)
  if (!nonce || !issuedAt || !signature) return false

  const payload = `${nonce}.${issuedAtRaw}`
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  if (signature.length !== expectedSignature.length) return false

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return false
  }

  const now = Math.floor(Date.now() / 1000)
  return now - issuedAt <= TOKEN_TTL_SECONDS
}

export function validateAdminRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : ''
  const cookieToken = request.cookies.get('admin_token')?.value || ''
  const token = bearerToken || cookieToken

  if (!token) return false
  return validateAdminToken(token)
}

export function getAdminTokenTtlSeconds() {
  return TOKEN_TTL_SECONDS
}
