'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import type { Todo } from '@/app/types'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getMonday(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

function getWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })
}

export default function WeekViewClient({ weekTodos }: { weekTodos: Todo[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const todayStr = toDateString(new Date())
  const selectedDateStr = searchParams.get('date') ?? todayStr
  const selectedDate = new Date(selectedDateStr + 'T00:00:00')
  const weekStart = getMonday(selectedDate)
  const weekDates = getWeekDates(weekStart)
  const weekEnd = weekDates[6]

  const setDate = (dateStr: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (dateStr === todayStr) params.delete('date')
    else params.set('date', dateStr)
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  const moveWeek = (direction: 1 | -1) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + direction * 7)
    setDate(toDateString(newDate))
  }

  const getCount = (dateStr: string) =>
    weekTodos.filter((t) => t.date === dateStr && !t.completed).length

  const formatWeekRange = () => {
    const startM = weekStart.getMonth() + 1
    const endM = weekEnd.getMonth() + 1
    if (startM === endM) {
      return `${weekStart.getFullYear()}년 ${startM}월 ${weekStart.getDate()}일 - ${weekEnd.getDate()}일`
    }
    return `${startM}월 ${weekStart.getDate()}일 - ${endM}월 ${weekEnd.getDate()}일`
  }

  return (
    <div className="flex flex-col gap-2 rounded-[14px] border border-[#e8e0f8] bg-white p-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => moveWeek(-1)}
          className="rounded-[8px] px-2 py-1.5 text-[#672be0] hover:bg-[#f0ebff] transition-colors text-[0.95rem]"
        >
          ←
        </button>
        <span className="text-[0.82rem] font-medium text-[#3d1a8e]">
          {formatWeekRange()}
        </span>
        <button
          onClick={() => moveWeek(1)}
          className="rounded-[8px] px-2 py-1.5 text-[#672be0] hover:bg-[#f0ebff] transition-colors text-[0.95rem]"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date, i) => {
          const dateStr = toDateString(date)
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDateStr
          const count = getCount(dateStr)

          return (
            <button
              key={dateStr}
              onClick={() => setDate(dateStr)}
              className={[
                'flex flex-col items-center gap-0.5 rounded-[10px] py-2 transition-colors',
                isToday
                  ? 'bg-primary text-white'
                  : isSelected
                  ? 'bg-[#ede8fb] text-[#3d1a8e]'
                  : 'text-[#555] hover:bg-[#f5f0ff]',
              ].join(' ')}
            >
              <span className="text-[0.68rem]">{DAYS[i]}</span>
              <span className="text-[0.88rem] font-semibold">{date.getDate()}</span>
              <span className={`text-[0.62rem] font-medium ${isToday ? 'text-white/80' : 'text-primary'} ${count === 0 ? 'invisible' : ''}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
