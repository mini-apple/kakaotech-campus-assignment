'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Todo } from './types'

const BACKEND_URL = process.env.BACKEND_URL

export async function getTodos(params?: {
  filter?: string
  search?: string
  date?: string
  date_from?: string
  date_to?: string
}): Promise<Todo[]> {
  const searchParams = new URLSearchParams()
  if (params?.filter) searchParams.set('filter', params.filter)
  if (params?.search) searchParams.set('search', params.search)
  if (params?.date) searchParams.set('date', params.date)
  if (params?.date_from) searchParams.set('date_from', params.date_from)
  if (params?.date_to) searchParams.set('date_to', params.date_to)
  const query = searchParams.toString()
  const res = await fetch(
    `${BACKEND_URL}/todos${query ? `?${query}` : ''}`,
    { cache: 'no-store' }
  )
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

export async function getTodo(id: string): Promise<Todo | null> {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string
  if (!title?.trim()) return
  await fetch(`${BACKEND_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.trim() }),
  })
  revalidatePath('/todos')
  redirect('/todos')
}

// .bind(null, id)로 호출 — formData는 form submit 시 자동 주입
export async function updateTodo(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const completed = formData.has('completed')
  await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title?.trim(), completed }),
  })
  revalidatePath('/todos')
  redirect('/todos')
}

export async function deleteTodo(id: string, _formData: FormData) {
  await fetch(`${BACKEND_URL}/todos/${id}`, { method: 'DELETE' })
  revalidatePath('/todos')
  redirect('/todos')
}
