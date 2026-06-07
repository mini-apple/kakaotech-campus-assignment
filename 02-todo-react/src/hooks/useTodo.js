import { useState, useEffect } from 'react'
import { toDateString, getMonday } from '../utils/dateUtils'

const STORAGE_KEY = 'todo-app-data'

const loadFromStorage = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return { todoList: [], nextId: 1, weekStartDate: null }
  return JSON.parse(saved)
}

export function useTodo() {
  const [todoList, setTodoList] = useState(() => loadFromStorage().todoList)
  const [nextId, setNextId] = useState(() => loadFromStorage().nextId)
  const [currentFilter, setCurrentFilter] = useState('all')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const { weekStartDate } = loadFromStorage()
    return weekStartDate ? new Date(weekStartDate) : getMonday(new Date())
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      todoList,
      nextId,
      weekStartDate: currentWeekStart.toISOString(),
    }))
  }, [todoList, nextId, currentWeekStart])

  // 날짜가 현재 주 범위를 벗어나면 weekStart 동기화
  const syncWeekToDate = (newDate) => {
    const weekEnd = new Date(currentWeekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    const s = toDateString(newDate)
    if (s < toDateString(currentWeekStart) || s > toDateString(weekEnd)) {
      setCurrentWeekStart(getMonday(newDate))
    }
  }

  const addTodo = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return false
    const newTodo = { id: nextId, text: trimmed, completed: false, date: toDateString(currentDate) }
    setTodoList((prev) => [...prev, newTodo])
    setNextId((prev) => prev + 1)
    return true
  }

  const deleteTodo = (id) => setTodoList((prev) => prev.filter((t) => t.id !== id))

  const toggleComplete = (id) =>
    setTodoList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )

  const saveEdit = (id, text) => {
    const trimmed = text.trim()
    if (!trimmed) return false
    setTodoList((prev) => prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t)))
    return true
  }

  const moveToPrevDate = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 1)
    setCurrentDate(d)
    syncWeekToDate(d)
  }

  const moveToNextDate = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 1)
    setCurrentDate(d)
    syncWeekToDate(d)
  }

  const moveToPrevWeek = () => {
    const d = new Date(currentWeekStart)
    d.setDate(d.getDate() - 7)
    setCurrentWeekStart(d)
  }

  const moveToNextWeek = () => {
    const d = new Date(currentWeekStart)
    d.setDate(d.getDate() + 7)
    setCurrentWeekStart(d)
  }

  // 주간 뷰 날짜 셀 클릭 → currentDate 업데이트
  const selectDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number)
    setCurrentDate(new Date(y, m - 1, d))
  }

  const getFilteredTodoList = () => {
    const dateTodos = todoList.filter((t) => t.date === toDateString(currentDate))
    if (currentFilter === 'active') return dateTodos.filter((t) => !t.completed)
    if (currentFilter === 'completed') return dateTodos.filter((t) => t.completed)
    return dateTodos
  }

  const dateTodos = todoList.filter((t) => t.date === toDateString(currentDate))

  return {
    todoList,
    filteredTodoList: getFilteredTodoList(),
    totalCount: dateTodos.length,
    completedCount: dateTodos.filter((t) => t.completed).length,
    currentFilter,
    setFilter: setCurrentFilter,
    currentDate,
    currentWeekStart,
    moveToPrevDate,
    moveToNextDate,
    moveToPrevWeek,
    moveToNextWeek,
    selectDate,
    addTodo,
    deleteTodo,
    toggleComplete,
    saveEdit,
  }
}
