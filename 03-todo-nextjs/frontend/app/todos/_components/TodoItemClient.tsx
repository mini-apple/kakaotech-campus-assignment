'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Todo } from '@/app/types'
import Button from './ui/Button'
import Input from './ui/Input'

export default function TodoItemClient({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      const len = inputRef.current.value.length
      inputRef.current.setSelectionRange(len, len)
    }
  }, [isEditing])

  const handleSave = async () => {
    if (!editValue.trim()) {
      inputRef.current?.focus()
      return
    }
    await fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editValue.trim() }),
    })
    setIsEditing(false)
    router.refresh()
  }

  const handleCancel = () => {
    setEditValue(todo.title)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

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
      {isEditing ? (
        <Input
          ref={inputRef}
          variant="editing"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={100}
          className="flex-1"
        />
      ) : (
        <span
          className={`flex-1 text-[0.95rem] leading-[1.4] break-all ${
            todo.completed ? 'line-through text-[#aaa]' : 'text-[#1a1a2e]'
          }`}
        >
          {todo.title}
        </span>
      )}

      <div className="flex gap-[6px] shrink-0">
        {isEditing ? (
          <>
            <Button size="sm" onClick={handleSave}>저장</Button>
            <Button size="sm" variant="secondary" onClick={handleCancel}>취소</Button>
          </>
        ) : (
          <>
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
              onClick={() => setIsEditing(true)}
            >
              수정
            </Button>
            <Button size="sm" variant="danger" onClick={handleDelete}>
              삭제
            </Button>
          </>
        )}
      </div>
    </li>
  )
}
