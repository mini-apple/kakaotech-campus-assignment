---
name: add-page
description: Next.js App Router 페이지 + Server/Client Component 분리 구조 스캐폴딩. 새 페이지 추가 시 사용.
disable-model-invocation: true
---

# /add-page [경로]

`$ARGUMENTS`에 경로(예: `todos`, `todos/new`, `todos/[todoId]`)를 받아 Next.js App Router 페이지를 스캐폴딩한다.

## 기본 원칙

**Server Component 우선.** `useState`, `useEffect`, 이벤트 핸들러가 필요한 경우에만 `'use client'` 추가.

## 생성 파일 구조

```
frontend/app/{경로}/
├── page.tsx          # Server Component (기본값)
├── loading.tsx       # 로딩 UI (Suspense fallback)
└── error.tsx         # 에러 바운더리
```

필요 시 추가:
- `{Name}Client.tsx` — 이벤트 핸들러나 상태 관리가 필요한 부분만 Client Component로 분리

## Server Component 패턴 (기본)

```typescript
// frontend/app/{경로}/page.tsx
import { get{Name}s } from '@/app/actions'

export default async function {Name}Page() {
  const data = await get{Name}s()
  
  return (
    <main>
      {/* Server Component: fetch는 여기서, 인터랙션은 Client Component로 위임 */}
    </main>
  )
}
```

## Client Component가 필요한 경우

```typescript
// frontend/app/{경로}/{Name}Client.tsx
'use client'

import { useState } from 'react'

interface {Name}ClientProps {
  // Server Component에서 props로 data 전달받음
}

export default function {Name}Client({ }: {Name}ClientProps) {
  const [state, setState] = useState(...)
  return <div onClick={...}>...</div>
}
```

## useSearchParams() 사용 시 — Suspense 필수

`useSearchParams()`를 쓰는 Client Component는 반드시 `<Suspense>`로 감싸야 한다. 누락 시 빌드 에러 발생.

```typescript
// page.tsx
import { Suspense } from 'react'
import {Name}Client from './{Name}Client'

export default function {Name}Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <{Name}Client />
    </Suspense>
  )
}
```

## loading.tsx 패턴

```typescript
export default function Loading() {
  return <div>로딩 중...</div>
}
```

## error.tsx 패턴

```typescript
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <p>오류가 발생했습니다: {error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  )
}
```

## 실행 후 체크리스트

- [ ] `page.tsx`가 Server Component로 생성됨 (`'use client'` 없음)
- [ ] `loading.tsx`, `error.tsx` 생성됨
- [ ] `useSearchParams()` 사용 시 `<Suspense>` 포함됨
- [ ] 이벤트 핸들러가 있는 부분만 별도 Client Component로 분리됨
- [ ] TypeScript `any` 없음
