import TodoItem from './TodoItem'

const EMPTY_MESSAGE = {
  all: '등록된 할 일이 없습니다.',
  active: '진행 중인 할 일이 없습니다.',
  completed: '완료된 할 일이 없습니다.',
}

export default function TodoList({ todoList, totalCount, completedCount, onToggle, onDelete, onSave, filter = 'all' }) {
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
        {todoList.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#bbb] text-[0.9rem]">{EMPTY_MESSAGE[filter]}</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-[10px] list-none">
            {todoList.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onSave={onSave}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
