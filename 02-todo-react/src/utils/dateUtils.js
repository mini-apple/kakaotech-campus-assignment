const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']
const WEEK_DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일']

export const toDateString = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const formatDateLabel = (date) => {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const day = DAY_NAMES[date.getDay()]
  const isToday = toDateString(date) === toDateString(new Date())
  return `${y}년 ${m}월 ${d}일 (${day})${isToday ? ' · 오늘' : ''}`
}

// 해당 날짜가 속한 주의 월요일 반환
export const getMonday = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

// 주 시작일(월요일)로부터 7일 Date 배열 반환
export const getWeekDates = (weekStart) =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

// 주간 범위 레이블 (크로스 월/년 처리)
export const formatWeekRangeLabel = (weekStart) => {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const sy = weekStart.getFullYear(), sm = weekStart.getMonth() + 1, sd = weekStart.getDate()
  const ey = weekEnd.getFullYear(), em = weekEnd.getMonth() + 1, ed = weekEnd.getDate()
  if (sy === ey && sm === em) return `${sy}년 ${sm}월 ${sd}일 - ${ed}일`
  if (sy === ey) return `${sy}년 ${sm}월 ${sd}일 - ${em}월 ${ed}일`
  return `${sy}년 ${sm}월 ${sd}일 - ${ey}년 ${em}월 ${ed}일`
}

export { WEEK_DAY_NAMES }
