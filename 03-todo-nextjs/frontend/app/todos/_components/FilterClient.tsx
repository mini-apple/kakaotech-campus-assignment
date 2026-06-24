'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Button from './ui/Button'

const FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'completed', label: '완료' },
] as const

export default function FilterClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const currentFilter = searchParams.get('filter') ?? 'all'

  const setFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') params.delete('filter')
    else params.set('filter', value)
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div className="flex gap-2 w-full">
      {FILTERS.map((f) => (
        <Button
          key={f.value}
          size="sm"
          variant={currentFilter === f.value ? 'primary' : 'secondary'}
          onClick={() => setFilter(f.value)}
          className="flex-1"
        >
          {f.label}
        </Button>
      ))}
    </div>
  )
}
