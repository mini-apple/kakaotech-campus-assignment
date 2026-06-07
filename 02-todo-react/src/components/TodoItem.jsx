import { useState, useRef, useEffect } from 'react'

export default function TodoItem({ todo, onToggle, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      const len = editValue.length
      inputRef.current?.setSelectionRange(len, len)
    }
  }, [isEditing])

  const handleSave = () => {
    if (!editValue.trim()) {
      inputRef.current?.focus()
      return
    }
    onSave(todo.id, editValue.trim())
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(todo.text)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  const baseItemClass = 'flex items-center gap-3 rounded-[12px] px-4 py-[14px] border transition-all duration-200'
  const itemClass = todo.completed
    ? `${baseItemClass} bg-[#fafafa] border-[#ebebeb] opacity-70`
    : `${baseItemClass} bg-white border-[#e8e0f8] hover:shadow-[0_2px_12px_rgba(103,43,224,0.08)] hover:border-[#cbb8f5]`

  return (
    <li className={itemClass}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={100}
          className="flex-1 px-[10px] py-[6px] border-2 border-primary rounded-[8px] text-[0.95rem] text-[#1a1a2e] outline-none"
        />
      ) : (
        <span className={`flex-1 text-[0.95rem] leading-[1.4] break-all ${todo.completed ? 'line-through text-[#aaa]' : 'text-[#1a1a2e]'}`}>
          {todo.text}
        </span>
      )}

      <div className="flex gap-[6px] shrink-0">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="px-3 py-[6px] border-none rounded-[8px] text-[0.8rem] font-semibold cursor-pointer bg-primary text-white hover:bg-[#5621c0] active:scale-[0.97] transition-all">저장</button>
            <button onClick={handleCancel} className="px-3 py-[6px] border-none rounded-[8px] text-[0.8rem] font-semibold cursor-pointer bg-[#f0f0f0] text-[#555] hover:bg-[#e0e0e0] active:scale-[0.97] transition-all">취소</button>
          </>
        ) : (
          <>
            <button onClick={() => onToggle(todo.id)} className={`px-3 py-[6px] border-none rounded-[8px] text-[0.8rem] font-semibold cursor-pointer active:scale-[0.97] transition-all ${todo.completed ? 'bg-primary text-white hover:bg-[#5621c0]' : 'bg-[#eee8fd] text-primary hover:bg-[#ddd0fb]'}`}>{todo.completed ? '완료됨' : '완료'}</button>
            <button onClick={() => setIsEditing(true)} disabled={todo.completed} className="px-3 py-[6px] border-none rounded-[8px] text-[0.8rem] font-semibold cursor-pointer bg-[#f0f0f0] text-[#555] hover:bg-[#e0e0e0] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed transition-all">수정</button>
            <button onClick={() => onDelete(todo.id)} className="px-3 py-[6px] border-none rounded-[8px] text-[0.8rem] font-semibold cursor-pointer bg-[#fce8e8] text-[#d93025] hover:bg-[#f5c6c6] active:scale-[0.97] transition-all">삭제</button>
          </>
        )}
      </div>
    </li>
  )
}
