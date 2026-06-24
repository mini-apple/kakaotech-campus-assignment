import PageLayout from './_components/ui/PageLayout'
import PageHeader from './_components/ui/PageHeader'
import TodoListContainer from './_components/ui/TodoListContainer'
import TodoList from './_components/ui/TodoList'
import EmptyState from './_components/ui/EmptyState'
import TodoInputClient from './_components/TodoInputClient'
import TodoItemClient from './_components/TodoItemClient'

interface Todo {
  id: number
  title: string
  completed: boolean
}

export default async function TodosPage() {
  // Step 3에서 getTodos() 연결
  const todos: Todo[] = []
  const completedCount = todos.filter((t) => t.completed).length

  return (
    <PageLayout>
      <PageHeader title="Next.js Todo" subtitle="오늘의 할 일을 관리하세요" />

      <TodoInputClient />

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
