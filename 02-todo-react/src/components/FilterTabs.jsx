const TABS = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '진행 중' },
  { key: 'completed', label: '완료' },
]

export default function FilterTabs({ currentFilter, onFilterChange }) {
  return (
    <div className="flex gap-[6px] bg-[#ede8fb] rounded-[12px] p-[5px]">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`flex-1 py-[9px] border-none rounded-[9px] text-[0.88rem] font-semibold cursor-pointer transition-all duration-200 ${
            currentFilter === key
              ? 'bg-white text-primary shadow-[0_1px_6px_rgba(103,43,224,0.15)]'
              : 'bg-transparent text-[#9b7fd4] hover:text-primary'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
