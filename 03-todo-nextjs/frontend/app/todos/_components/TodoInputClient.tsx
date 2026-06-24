'use client'

import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from './ui/Button'
import Input from './ui/Input'
import Text from './ui/Text'

function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function TodoInputClient() {
  const [value, setValue] = useState('')
  const [showError, setShowError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleAdd = async () => {
    if (!value.trim()) {
      setShowError(true)
      inputRef.current?.focus()
      return
    }
    const currentDate = searchParams.get('date') ?? toDateString(new Date())
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: value.trim(), date: currentDate }),
    })
    setValue('')
    setShowError(false)
    router.refresh()
    inputRef.current?.focus()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    if (e.target.value.trim()) setShowError(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력하세요"
          maxLength={100}
          className="flex-1"
        />
        <Button onClick={handleAdd} className="whitespace-nowrap">
          추가
        </Button>
      </div>
      {showError && <Text variant="error" className="pl-1">할 일을 입력해주세요.</Text>}
    </div>
  )
}
