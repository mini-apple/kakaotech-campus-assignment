---
description: Next.js + TypeScript 프론트엔드 규칙. frontend/ 디렉토리 작업 시 항상 적용.
paths:
  - frontend/**
---

## 데이터 흐름

```
클라이언트 → route.ts(프록시) → FastAPI    # 브라우저에서 오는 요청
actions.ts  ─────────────────→ FastAPI    # Server Component/Action에서 직접 호출
```

- `route.ts`: 브라우저 → FastAPI CORS 우회 프록시. 외부 HTTP 요청 수신.
- `actions.ts`: Server Component와 Client Component 양쪽에서 import 가능. 서버에서 직접 FastAPI 호출.
- **필터링·검색은 FastAPI에서 처리.** 클라이언트 사이드 필터링 금지.

## Server Component vs Client Component

- **Server Component 우선.** `useState`, `useEffect`, 이벤트 핸들러가 필요할 때만 `'use client'` 추가.
- `useSearchParams()`를 쓰는 컴포넌트는 반드시 `<Suspense>`로 감싸야 함. 누락 시 빌드 에러.

## TypeScript 규칙

- API URL 하드코딩 금지 → 환경변수 사용 (`process.env.BACKEND_URL`, `process.env.NEXT_PUBLIC_API_URL`)
- `any` 타입 금지
- `console.log` 커밋 금지
- 환경변수 수정 후 반드시 개발 서버 재시작

## 자주 발생하는 에러

| 에러 | 원인 | 해결 |
|------|------|------|
| CORS blocked | 클라이언트에서 FastAPI 직접 호출 | `route.ts` 프록시 경유 |
| `Failed to parse URL from undefined` | `NEXT_PUBLIC_` 접두사 누락 또는 서버 재시작 필요 | 접두사 확인 후 재시작 |
| `Event handlers cannot be passed to Client Component` | Server Component에 이벤트 핸들러 | `'use client'` 추가 |
| `Missing Suspense boundary with useSearchParams` | Suspense 누락 | `<Suspense>`로 감싸기 |
