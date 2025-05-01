// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status })
  }

  const response = NextResponse.json({ access: data.access, username: data.username })
  return response
}
