# Step 3 — API Route 작성 및 프론트-백엔드 연동

## 목표

`route.ts` 프록시와 `actions.ts` Server Actions를 작성하고, Step 2의 페이지에 실제 데이터를 연결한다.

## 구현 파일

| 파일 | 역할 |
|------|------|
| `frontend/app/api/todos/route.ts` | GET, POST 프록시 |
| `frontend/app/api/todos/[todoId]/route.ts` | PUT, DELETE 프록시 |
| `frontend/app/actions.ts` | Server Actions (서버에서 FastAPI 직접 호출) |

## route.ts 패턴

브라우저에서 오는 요청을 FastAPI로 전달. `BACKEND_URL` 환경변수 사용.

```typescript
// frontend/app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const res = await fetch(`${BACKEND_URL}/todos?${searchParams.toString()}`)
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return NextResponse.json(await res.json(), { status: res.status })
}
```

```typescript
// frontend/app/api/todos/[todoId]/route.ts
export async function PUT(request: NextRequest, { params }: { params: { todoId: string } }) {
  const body = await request.json()
  const res = await fetch(`${BACKEND_URL}/todos/${params.todoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return NextResponse.json(await res.json(), { status: res.status })
}

export async function DELETE(_: NextRequest, { params }: { params: { todoId: string } }) {
  const res = await fetch(`${BACKEND_URL}/todos/${params.todoId}`, { method: 'DELETE' })
  return new NextResponse(null, { status: res.status })
}
```

## actions.ts 패턴

Server Component / Server Action에서 FastAPI를 직접 호출 (CORS 없음).

```typescript
'use server'
import { revalidatePath } from 'next/cache'

const BACKEND_URL = process.env.BACKEND_URL

export async function getTodos() {
  const res = await fetch(`${BACKEND_URL}/todos`, { cache: 'no-store' })
  return res.json()
}

export async function getTodo(id: string) {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string
  await fetch(`${BACKEND_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  revalidatePath('/todos')
}

export async function updateTodo(id: string, data: { title?: string; completed?: boolean }) {
  await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  revalidatePath('/todos')
}

export async function deleteTodo(id: string) {
  await fetch(`${BACKEND_URL}/todos/${id}`, { method: 'DELETE' })
  revalidatePath('/todos')
}
```

## 페이지 연동

Step 2 페이지에 actions.ts import 추가:
- `todos/page.tsx` → `getTodos()` 호출
- `todos/new/page.tsx` → form action에 `createTodo` 연결
- `todos/[todoId]/page.tsx` → `getTodo()`, `updateTodo()`, `deleteTodo()` 연결

## 검증

1. 백엔드 + 프론트엔드 모두 실행
2. `http://localhost:3000/todos` — FastAPI에서 가져온 목록 표시
3. 새 Todo 생성 → 목록에 반영
4. Todo 수정/삭제 → 목록 갱신
5. 브라우저 DevTools → Network 탭에서 요청 흐름 확인
   - 생성/수정/삭제: 브라우저 → `/api/todos` (route.ts) → FastAPI 순서
   - 목록 조회: Server Component에서 직접 FastAPI 호출 (브라우저 요청 없음)
