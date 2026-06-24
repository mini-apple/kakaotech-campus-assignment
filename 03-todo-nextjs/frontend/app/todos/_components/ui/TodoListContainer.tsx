interface TodoListContainerProps {
  totalCount: number
  completedCount: number
  children: React.ReactNode
}

export default function TodoListContainer({
  totalCount,
  completedCount,
  children,
}: TodoListContainerProps) {
  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <div className="flex gap-2">
        <span className="text-[0.78rem] font-semibold px-[10px] py-1 rounded-[20px] bg-[#e9e4f7] text-primary">
          전체 {totalCount}
        </span>
        <span className="text-[0.78rem] font-semibold px-[10px] py-1 rounded-[20px] bg-[#d4edda] text-[#276b38]">
          완료 {completedCount}
        </span>
      </div>
      <div className="flex-1 min-h-0 bg-[#f0edf8] border border-[#e4ddf5] rounded-[12px] p-4 overflow-y-auto flex flex-col">
        {children}
      </div>
    </div>
  )
}
