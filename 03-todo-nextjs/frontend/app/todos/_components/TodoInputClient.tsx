'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Button from './ui/Button'
import Input from './ui/Input'
import Text from './ui/Text'

export default function TodoInputClient() {
  const [value, setValue] = useState('')
  const [showError, setShowError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleAdd = async () => {
    if (!value.trim()) {
      setShowError(true)
      inputRef.current?.focus()
      return
    }
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: value.trim() }),
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
