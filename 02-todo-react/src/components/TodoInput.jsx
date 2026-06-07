import { useState, useRef } from 'react'

export default function TodoInput({ onAdd }) {
  const [value, setValue] = useState('')
  const [showError, setShowError] = useState(false)
  const inputRef = useRef(null)

  const handleAdd = () => {
    if (!value.trim()) {
      setShowError(true)
      inputRef.current?.focus()
      return
    }
    onAdd(value.trim())
    setValue('')
    setShowError(false)
    inputRef.current?.focus()
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    if (e.target.value.trim()) setShowError(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력하세요"
          maxLength={100}
          className="flex-1 px-4 py-3 border-2 border-[#e0d6f7] rounded-[10px] text-[0.95rem] bg-white text-[#1a1a2e] outline-none focus:border-primary transition-colors duration-200"
        />
        <button
          onClick={handleAdd}
          className="px-5 py-3 whitespace-nowrap bg-primary text-white font-semibold text-[0.9rem] rounded-[10px] border-none cursor-pointer hover:bg-[#5621c0] active:scale-[0.97] transition-all duration-200"
        >
          추가
        </button>
      </div>
      {showError && (
        <p className="text-[0.82rem] text-[#d93025] pl-1">할 일을 입력해주세요.</p>
      )}
    </div>
  )
}
