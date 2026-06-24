import { Suspense } from 'react'
import { getTodos } from '@/app/actions'
import PageLayout from './_components/ui/PageLayout'
import PageHeader from './_components/ui/PageHeader'
import TodoListContainer from './_components/ui/TodoListContainer'
import TodoList from './_components/ui/TodoList'
import EmptyState from './_components/ui/EmptyState'
import TodoInputClient from './_components/TodoInputClient'
import TodoItemClient from './_components/TodoItemClient'
import FilterClient from './_components/FilterClient'
import SearchClient from './_components/SearchClient'
import WeekViewClient from './_components/WeekViewClient'

function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getWeekRange(dateStr: string): [string, string] {
  const date = new Date(dateStr + 'T00:00:00')
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return [toDateString(monday), toDateString(sunday)]
}

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; search?: string; date?: string }>
}) {
  const { filter, search, date } = await searchParams
  const today = toDateString(new Date())
  const selectedDate = date ?? today

  const [todos, weekTodos] = await Promise.all([
    getTodos({ filter, search, date: selectedDate }),
    getTodos({ date_from: getWeekRange(selectedDate)[0], date_to: getWeekRange(selectedDate)[1] }),
  ])

  const completedCount = todos.filter((t) => t.completed).length

  return (
    <PageLayout>
      <PageHeader title="Next.js Todo" subtitle="오늘의 할 일을 관리하세요" />

      <Suspense fallback={null}>
        <WeekViewClient weekTodos={weekTodos} />
      </Suspense>

      <Suspense fallback={null}>
        <TodoInputClient />
      </Suspense>

      <Suspense fallback={null}>
        <SearchClient />
        <FilterClient />
      </Suspense>

      <TodoListContainer totalCount={todos.length} completedCount={completedCount}>
        {todos.length === 0 ? (
          <EmptyState message="등록된 할 일이 없습니다." />
        ) : (
          <TodoList>
            {todos.map((todo) => (
              <TodoItemClient key={todo.id} todo={todo} />
            ))}
          </TodoList>
        )}
      </TodoListContainer>
    </PageLayout>
  )
}
