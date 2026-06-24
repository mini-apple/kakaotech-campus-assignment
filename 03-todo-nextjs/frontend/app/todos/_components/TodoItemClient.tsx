'use client'

import { useRouter } from 'next/navigation'
import type { Todo } from '@/app/types'
import Button from './ui/Button'

export default function TodoItemClient({ todo }: { todo: Todo }) {
  const router = useRouter()

  const handleToggle = async () => {
    await fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    })
    router.refresh()
  }

  const handleDelete = async () => {
    await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' })
    router.refresh()
  }

  const baseClass =
    'flex items-center gap-3 rounded-[12px] px-4 py-[14px] border transition-all duration-200'
  const itemClass = todo.completed
    ? `${baseClass} bg-[#fafafa] border-[#ebebeb] opacity-70`
    : `${baseClass} bg-white border-[#e8e0f8] hover:shadow-[0_2px_12px_rgba(103,43,224,0.08)] hover:border-[#cbb8f5]`

  return (
    <li className={itemClass}>
      <span
        className={`flex-1 text-[0.95rem] leading-[1.4] break-all ${
          todo.completed ? 'line-through text-[#aaa]' : 'text-[#1a1a2e]'
        }`}
      >
        {todo.title}
      </span>

      <div className="flex gap-[6px] shrink-0">
        <Button
          size="sm"
          variant={todo.completed ? 'primary' : 'ghost'}
          onClick={handleToggle}
        >
          {todo.completed ? '완료됨' : '완료'}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={todo.completed}
          onClick={() => router.push(`/todos/${todo.id}`)}
        >
          수정
        </Button>
        <Button size="sm" variant="danger" onClick={handleDelete}>
          삭제
        </Button>
      </div>
    </li>
  )
}
