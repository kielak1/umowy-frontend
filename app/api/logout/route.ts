import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Wylogowano' })
  response.cookies.set('refresh_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/auth/token/refresh/',
    expires: new Date(0),
  })
  return response
}
