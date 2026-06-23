# Step 2 — Next.js Todo 페이지 구현

## 목표

`frontend/app/todos/` 아래에 목록·생성·수정 페이지를 Server Component 기반으로 구현한다.
이 단계에서는 actions.ts가 없으므로 데이터 없이 UI 구조만 완성한다.

> `/add-page [경로]` skill로 각 페이지를 스캐폴딩할 수 있다.

## 구현 파일

| 파일 | 역할 |
|------|------|
| `frontend/app/todos/page.tsx` | Todo 목록 페이지 (Server Component) |
| `frontend/app/todos/loading.tsx` | 목록 로딩 UI |
| `frontend/app/todos/error.tsx` | 목록 에러 바운더리 |
| `frontend/app/todos/new/page.tsx` | Todo 생성 페이지 |
| `frontend/app/todos/[todoId]/page.tsx` | Todo 수정/삭제 페이지 |

## 핵심 패턴

### 목록 페이지 (`todos/page.tsx`)

```typescript
// Server Component — 'use client' 없음
export default async function TodosPage() {
  // Step 3 완료 후 actions.ts에서 데이터 fetch
  // 지금은 빈 배열로 시작
  const todos: TodoResponse[] = []

  return (
    <main>
      <h1>Todo 목록</h1>
      <a href="/todos/new">새 Todo</a>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <a href={`/todos/${todo.id}`}>{todo.title}</a>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

### 생성 페이지 (`todos/new/page.tsx`)

form action을 Server Action으로 연결 (Step 3에서 actions.ts 완성 후 연결).

```typescript
export default function NewTodoPage() {
  return (
    <main>
      <h1>새 Todo</h1>
      <form>
        <input name="title" placeholder="Todo 제목" required />
        <button type="submit">추가</button>
      </form>
    </main>
  )
}
```

### 수정 페이지 (`todos/[todoId]/page.tsx`)

```typescript
export default async function TodoDetailPage({
  params,
}: {
  params: { todoId: string }
}) {
  // Step 3 이후 getTodo(params.todoId) 호출
  return (
    <main>
      <h1>Todo 수정</h1>
      {/* 수정 폼 */}
    </main>
  )
}
```

### loading.tsx / error.tsx

```typescript
// frontend/app/todos/loading.tsx
export default function Loading() {
  return <div>로딩 중...</div>
}
```

```typescript
// frontend/app/todos/error.tsx
'use client'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div>
      <p>오류가 발생했습니다.</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  )
}
```

> `error.tsx`는 반드시 `'use client'`여야 한다 — Next.js 요구사항.

## Server vs Client Component 구분

| 파일 | 선언 | 이유 |
|------|------|------|
| `todos/page.tsx` | 없음 (Server) | 데이터 fetch만, 이벤트 핸들러 없음 |
| `todos/loading.tsx` | 없음 (Server) | 정적 UI |
| `todos/error.tsx` | `'use client'` 필수 | Next.js 에러 바운더리 요구사항 |
| `todos/new/page.tsx` | 없음 (Server) | form action은 Server Action 연결 |
| `todos/[todoId]/page.tsx` | 없음 (Server) | 데이터 fetch + Server Action 연결 |

클라이언트 상태(`useState`, `useEffect`)나 이벤트 핸들러가 필요한 경우에만 `'use client'` 추가.

## 검증

1. `npm run dev` 실행
2. `http://localhost:3000/todos` — 빈 목록 페이지 렌더링 확인
3. `http://localhost:3000/todos/new` — 생성 폼 렌더링 확인
4. `http://localhost:3000/todos/1` — 수정 페이지 렌더링 확인
5. TypeScript 에러 없음 (`npm run lint`)
