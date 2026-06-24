# Step 6 — 서버 기반 Todo 검색

## 목표

`search` 쿼리 파라미터로 Todo 제목을 FastAPI에서 LIKE 검색하고,
URL 상태로 관리되는 검색 UI를 Next.js에 추가한다.

> `/add-server-filter search` skill로 스캐폴딩 가능.

## 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `backend/main.py` | GET /todos에 `search` 파라미터 추가 (filter와 병행) |
| `frontend/app/actions.ts` | Step 5에서 이미 `search` 파라미터 포함 시 수정 불필요 |
| `frontend/app/todos/page.tsx` | 이미 searchParams 전달 중이면 수정 불필요 |
| `frontend/app/todos/SearchClient.tsx` | 신규 — 검색 입력 UI (Client Component) |

## FastAPI 변경

filter와 search를 함께 처리:

```python
@app.get("/todos", response_model=list[TodoResponse])
def get_todos(
    filter: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Todo)

    if filter == "active":
        query = query.filter(Todo.completed == False)
    elif filter == "completed":
        query = query.filter(Todo.completed == True)

    if search:
        query = query.filter(Todo.title.ilike(f"%{search}%"))

    return query.all()
```

## SearchClient.tsx (신규)

디바운스를 적용해 입력마다 API 호출을 방지한다.

```typescript
'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState(searchParams.get('search') ?? '')

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set('search', value)
      else params.delete('search')
      router.push(`${pathname}?${params.toString()}`)
    }, 300) // 300ms 디바운스
    return () => clearTimeout(timer)
  }, [value])

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="검색..."
    />
  )
}
```

## page.tsx 변경 (SearchClient 추가)

```typescript
<Suspense fallback={<div>로딩 중...</div>}>
  <FilterClient />
  <SearchClient />
</Suspense>
```

## 검증

1. 검색창에 입력 → 300ms 후 URL 변경 + 목록 갱신
2. `?search=테스트` — "테스트" 포함 Todo만 표시
3. `?filter=active&search=테스트` — 필터 + 검색 동시 적용
4. 검색어 지우면 전체 목록 복원
5. URL 직접 입력해도 검색 적용됨 (SSR 검증)
