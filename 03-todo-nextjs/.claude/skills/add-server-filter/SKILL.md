---
name: add-server-filter
description: FastAPI 쿼리 파라미터 + route.ts 전달 + actions.ts + Next.js URL 파라미터 연동 패턴 스캐폴딩. Step 5(상태 필터), Step 6(검색) 등 서버 기반 필터링 추가 시 사용.
disable-model-invocation: true
---

# /add-server-filter [파라미터명]

`$ARGUMENTS`에 파라미터명(예: `filter`, `search`)을 받아 FastAPI → route.ts → actions.ts → Next.js까지 쿼리 파라미터를 전파하는 패턴을 추가한다.

## 수정 대상 4곳

### 1. `backend/main.py` — Optional 쿼리 파라미터 + SQLAlchemy filter 추가

```python
from typing import Optional

# GET /todos 라우터에 파라미터 추가
@app.get("/todos", response_model=list[TodoResponse])
def get_todos(
    $ARGUMENTS: Optional[str] = None,  # 추가
    db: Session = Depends(get_db)
):
    query = db.query(Todo)

    # filter 파라미터 예시
    if $ARGUMENTS == "active":
        query = query.filter(Todo.completed == False)
    elif $ARGUMENTS == "completed":
        query = query.filter(Todo.completed == True)

    # search 파라미터 예시
    # if $ARGUMENTS:
    #     query = query.filter(Todo.title.ilike(f"%{$ARGUMENTS}%"))

    return query.all()
```

기존 파라미터가 있으면 함께 병기:
```python
def get_todos(filter: Optional[str] = None, search: Optional[str] = None, db: ...):
```

### 2. `frontend/app/api/todos/route.ts` — searchParams 전달

이미 URL searchParams를 전달하고 있으면 수정 불필요. 없으면 추가:

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  // searchParams를 그대로 FastAPI로 전달
  const res = await fetch(`${BACKEND_URL}/todos?${searchParams.toString()}`)
  return NextResponse.json(await res.json())
}
```

### 3. `frontend/app/actions.ts` — 파라미터 포함 fetch

```typescript
export async function getTodos(params?: {
  filter?: string
  search?: string
}) {
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

### 4. `frontend/app/todos/page.tsx` — searchParams prop 읽기 + Suspense

```typescript
// Server Component — searchParams prop으로 받음
export default async function TodosPage({
  searchParams,
}: {
  searchParams: { filter?: string; search?: string }
}) {
  const todos = await getTodos(searchParams)

  return (
    <main>
      <Suspense fallback={<div>로딩 중...</div>}>
        {/* useSearchParams()를 쓰는 Client Component를 여기서 감쌈 */}
        <FilterClient />
      </Suspense>
      {/* 목록 렌더링 */}
    </main>
  )
}
```

Client Component 패턴 (`FilterClient.tsx` 또는 `SearchClient.tsx`):
```typescript
'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export default function FilterClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (/* UI */)
}
```

## 실행 후 체크리스트

- [ ] `backend/main.py` GET /todos에 `$ARGUMENTS` 파라미터 추가됨
- [ ] SQLAlchemy filter/where clause 추가됨
- [ ] `route.ts`에서 searchParams가 FastAPI URL로 전달됨
- [ ] `actions.ts`의 `getTodos()`가 파라미터를 받아 URL에 포함함
- [ ] `page.tsx`가 searchParams prop을 읽고 getTodos()에 전달함
- [ ] Client Component가 `<Suspense>`로 감싸짐
- [ ] TypeScript `any` 없음
