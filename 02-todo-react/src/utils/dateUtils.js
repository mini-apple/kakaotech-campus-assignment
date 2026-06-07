const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

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
