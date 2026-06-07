import { toDateString, getWeekDates, formatWeekRangeLabel, WEEK_DAY_NAMES } from '../utils/dateUtils'

export default function WeekView({ todoList, currentDate, currentWeekStart, onSelectDate, onPrevWeek, onNextWeek }) {
  const todayStr = toDateString(new Date())
  const selectedStr = toDateString(currentDate)
  const weekDates = getWeekDates(currentWeekStart)

  const getCount = (dateStr) =>
    todoList.filter((t) => t.date === dateStr && !t.completed).length

  return (
    <div className="bg-white border border-[#e8e0f8] rounded-[16px] px-3 py-[14px] flex flex-col gap-3">
      {/* 주간 네비게이션 */}
      <div className="flex items-center justify-between px-1">
        <button onClick={onPrevWeek} className="border-none bg-transparent text-primary cursor-pointer px-[10px] py-[5px] rounded-[8px] hover:bg-[#f0ebff] transition-colors text-base leading-none">←</button>
        <span className="text-[0.82rem] font-semibold text-[#9b7fd4]">{formatWeekRangeLabel(currentWeekStart)}</span>
        <button onClick={onNextWeek} className="border-none bg-transparent text-primary cursor-pointer px-[10px] py-[5px] rounded-[8px] hover:bg-[#f0ebff] transition-colors text-base leading-none">→</button>
      </div>

      {/* 7일 그리드 */}
      <div className="grid grid-cols-7 gap-[2px]">
        {weekDates.map((date, i) => {
          const dateStr = toDateString(date)
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedStr
          const count = getCount(dateStr)

          const dayNameClass = isToday || isSelected
            ? 'text-[0.68rem] font-bold text-primary'
            : 'text-[0.68rem] font-medium text-[#bbb]'

          const dateNumClass = isToday
            ? `bg-primary text-white ${isSelected ? 'shadow-[0_0_0_3px_rgba(103,43,224,0.25)]' : ''}`
            : isSelected
            ? 'bg-[#ede8fb] text-primary'
            : 'text-[#1a1a2e]'

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className="flex flex-col items-center gap-1 py-[7px] px-[2px] border-none rounded-[10px] bg-transparent cursor-pointer hover:bg-[#f8f5ff] transition-colors"
            >
              <span className={dayNameClass}>{WEEK_DAY_NAMES[i]}</span>
              <span className={`text-[0.92rem] font-semibold w-[30px] h-[30px] flex items-center justify-center rounded-full ${dateNumClass}`}>
                {date.getDate()}
              </span>
              <span className={`text-[0.65rem] font-semibold min-h-[12px] leading-none mt-[3px] ${count > 0 ? 'text-[#9b7fd4]' : 'text-transparent'}`}>
                {count > 0 ? `${count}개` : '0'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
