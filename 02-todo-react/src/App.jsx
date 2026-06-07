import { useTodo } from './hooks/useTodo'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'

function App() {
  const {
    todoList,
    totalCount,
    completedCount,
    addTodo,
    deleteTodo,
    toggleComplete,
    saveEdit,
  } = useTodo()

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col gap-8">
      <header className="text-center">
        <h1 className="text-[2rem] font-bold text-primary tracking-[-0.5px]">React Todo</h1>
        <p className="mt-[6px] text-[0.9rem] text-[#888]">오늘의 할 일을 관리하세요</p>
      </header>

      <TodoInput onAdd={addTodo} />

      <TodoList
        todoList={todoList}
        totalCount={totalCount}
        completedCount={completedCount}
        onToggle={toggleComplete}
        onDelete={deleteTodo}
        onSave={saveEdit}
      />
    </div>
  )
}

export default App
