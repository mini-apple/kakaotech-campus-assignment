# Step 5 — 서버 기반 상태별 필터링

## 목표

`filter` 쿼리 파라미터로 active/completed Todo를 FastAPI에서 필터링하고,
URL 상태로 관리되는 필터 UI를 Next.js에 추가한다.

> `/add-server-filter filter` skill로 스캐폴딩 가능.

## 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `backend/main.py` | GET /todos에 `filter` 쿼리 파라미터 추가 |
| `frontend/app/api/todos/route.ts` | 이미 searchParams 전달 중이면 수정 불필요 |
| `frontend/app/actions.ts` | `getTodos(params?)` 시그니처 확장 |
| `frontend/app/todos/page.tsx` | `searchParams` prop 읽기 |
| `frontend/app/todos/FilterClient.tsx` | 신규 — 필터 버튼 UI (Client Component) |

## FastAPI 변경

```python
from typing import Optional

@app.get("/todos", response_model=list[TodoResponse])
def get_todos(filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Todo)
    if filter == "active":
        query = query.filter(Todo.completed == False)
    elif filter == "completed":
        query = query.filter(Todo.completed == True)
    return query.all()
```

## actions.ts 변경

```typescript
export async function getTodos(params?: { filter?: string; search?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.filter) searchParams.set('filter', params.filter)
  if (params?.search) searchParams.set('search', params.search)
  const query = searchParams.toString()
  const res = await fetch(
    `${process.env.BACKEND_URL}/todos${query ? `?${query}` : ''}`,
    { cache: 'no-store' }
  )
  return res.json()
}
```

## page.tsx 변경

```typescript
export default async function TodosPage({
  searchParams,
}: {
  searchParams: { filter?: string; search?: string }
}) {
  const todos = await getTodos(searchParams)
  return (
    <main>
      <Suspense fallback={<div>로딩 중...</div>}>
        <FilterClient />
      </Suspense>
      {/* 목록 */}
    </main>
  )
}
```

## FilterClient.tsx (신규)

```typescript
'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export default function FilterClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const currentFilter = searchParams.get('filter') ?? 'all'

  const setFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') params.delete('filter')
    else params.set('filter', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div>
      {['all', 'active', 'completed'].map((f) => (
        <button key={f} onClick={() => setFilter(f)}
          style={{ fontWeight: currentFilter === f ? 'bold' : 'normal' }}>
          {f}
        </button>
      ))}
    </div>
  )
}
```

## 검증

1. `http://localhost:3000/todos` — 전체 목록 표시
2. `?filter=active` — 미완료만 표시
3. `?filter=completed` — 완료만 표시
4. 필터 버튼 클릭 시 URL 변경 + 목록 갱신
5. URL 직접 입력해도 필터 적용됨 (SSR 검증)
6. `?filter=active` 상태에서 새 Todo 추가 → 필터가 유지된 채로 목록 갱신 확인
7. 브라우저 Network 탭에서 FastAPI로 `?filter=active` 쿼리가 전달되는지 확인 (클라이언트 필터링이 아님을 검증)
