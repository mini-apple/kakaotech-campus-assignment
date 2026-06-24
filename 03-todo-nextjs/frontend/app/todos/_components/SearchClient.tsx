'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Input from './ui/Input'

export default function SearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState(searchParams.get('search') ?? '')

  useEffect(() => {
    const currentSearch = searchParams.get('search') ?? ''
    if (currentSearch === value) return

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set('search', value)
      else params.delete('search')
      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname)
    }, 300)
    return () => clearTimeout(timer)
  }, [value, searchParams, router, pathname])

  return (
    <Input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="할 일 검색..."
      className="w-full"
    />
  )
}
