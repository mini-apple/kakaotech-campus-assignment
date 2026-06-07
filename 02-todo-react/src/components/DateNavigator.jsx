import { formatDateLabel, toDateString } from '../utils/dateUtils'

export default function DateNavigator({ currentDate, onPrev, onNext }) {
  const isToday = toDateString(currentDate) === toDateString(new Date())

  return (
    <div className="flex items-center justify-between bg-white border border-[#e8e0f8] rounded-[12px] px-4 py-3">
      <button onClick={onPrev} className="border-none bg-transparent text-primary text-[1.1rem] cursor-pointer px-[10px] py-[6px] rounded-[8px] hover:bg-[#f0ebff] transition-colors leading-none">
        ←
      </button>
      <span className={`text-[0.95rem] font-semibold tracking-[-0.2px] ${isToday ? 'text-primary' : 'text-[#1a1a2e]'}`}>
        {formatDateLabel(currentDate)}
      </span>
      <button onClick={onNext} className="border-none bg-transparent text-primary text-[1.1rem] cursor-pointer px-[10px] py-[6px] rounded-[8px] hover:bg-[#f0ebff] transition-colors leading-none">
        →
      </button>
    </div>
  )
}
