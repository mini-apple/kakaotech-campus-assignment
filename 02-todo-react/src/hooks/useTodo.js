import { useState } from 'react'

const toDateString = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function useTodo() {
  const [todoList, setTodoList] = useState([])
  const [nextId, setNextId] = useState(1)
  const [currentFilter, setCurrentFilter] = useState('all')

  const addTodo = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return false

    const newTodo = {
      id: nextId,
      text: trimmed,
      completed: false,
      date: toDateString(new Date()),
    }
    setTodoList((prev) => [...prev, newTodo])
    setNextId((prev) => prev + 1)
    return true
  }

  const deleteTodo = (id) => {
    setTodoList((prev) => prev.filter((todo) => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodoList((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const saveEdit = (id, text) => {
    const trimmed = text.trim()
    if (!trimmed) return false

    setTodoList((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: trimmed } : todo
      )
    )
    return true
  }

  const getFilteredTodoList = () => {
    if (currentFilter === 'active') return todoList.filter((t) => !t.completed)
    if (currentFilter === 'completed') return todoList.filter((t) => t.completed)
    return todoList
  }

  const totalCount = todoList.length
  const completedCount = todoList.filter((t) => t.completed).length

  return {
    filteredTodoList: getFilteredTodoList(),
    totalCount,
    completedCount,
    currentFilter,
    setFilter: setCurrentFilter,
    addTodo,
    deleteTodo,
    toggleComplete,
    saveEdit,
  }
}
