import { useState } from 'react'
import { toDateString } from '../utils/dateUtils'

export function useTodo() {
  const [todoList, setTodoList] = useState([])
  const [nextId, setNextId] = useState(1)
  const [currentFilter, setCurrentFilter] = useState('all')
  const [currentDate, setCurrentDate] = useState(new Date())

  const addTodo = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return false

    const newTodo = {
      id: nextId,
      text: trimmed,
      completed: false,
      date: toDateString(currentDate),
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

  const moveToPrevDate = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() - 1)
      return d
    })
  }

  const moveToNextDate = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() + 1)
      return d
    })
  }

  const getFilteredTodoList = () => {
    const dateTodos = todoList.filter((t) => t.date === toDateString(currentDate))
    if (currentFilter === 'active') return dateTodos.filter((t) => !t.completed)
    if (currentFilter === 'completed') return dateTodos.filter((t) => t.completed)
    return dateTodos
  }

  const dateTodos = todoList.filter((t) => t.date === toDateString(currentDate))
  const totalCount = dateTodos.length
  const completedCount = dateTodos.filter((t) => t.completed).length

  return {
    filteredTodoList: getFilteredTodoList(),
    totalCount,
    completedCount,
    currentFilter,
    setFilter: setCurrentFilter,
    currentDate,
    moveToPrevDate,
    moveToNextDate,
    addTodo,
    deleteTodo,
    toggleComplete,
    saveEdit,
  }
}
