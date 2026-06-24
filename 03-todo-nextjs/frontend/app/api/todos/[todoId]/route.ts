import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ todoId: string }> }
) {
  const { todoId } = await params
  const body = await request.json()
  const res = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return NextResponse.json(await res.json(), { status: res.status })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ todoId: string }> }
) {
  const { todoId } = await params
  const res = await fetch(`${BACKEND_URL}/todos/${todoId}`, { method: 'DELETE' })
  return new NextResponse(null, { status: res.status })
}
