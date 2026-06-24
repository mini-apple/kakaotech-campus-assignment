import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const res = await fetch(`${BACKEND_URL}/todos?${searchParams.toString()}`)
  return NextResponse.json(await res.json(), { status: res.status })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return NextResponse.json(await res.json(), { status: res.status })
}
