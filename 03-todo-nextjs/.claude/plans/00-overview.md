# Todo App (Next.js + FastAPI) — 개발 계획 개요

## 6단계 개발 순서

| 단계 | 내용 | 플랜 문서 |
|------|------|-----------|
| Step 1 | FastAPI CRUD API 구현 | `step-01-fastapi-crud.md` |
| Step 2 | Next.js Todo 페이지 구현 | `step-02-nextjs-todo-pages.md` |
| Step 3 | API Route + 프론트-백엔드 연동 | `step-03-api-route-integration.md` |
| Step 4 | 환경변수 설정 | `step-04-env-setup.md` |
| Step 5 | 서버 기반 상태별 필터링 | `step-05-status-filter.md` |
| Step 6 | 서버 기반 검색 기능 | `step-06-search-feature.md` |

## 데이터 흐름

```
[브라우저]
    │ fetch /api/todos (NEXT_PUBLIC_API_URL)
    ▼
[route.ts — Next.js API Route 프록시]
    │ fetch http://localhost:8000/todos (BACKEND_URL)
    ▼
[FastAPI — SQLite/SQLAlchemy]

[Server Component / Server Action]
    │ fetch http://localhost:8000/todos (BACKEND_URL, 서버에서 직접)
    ▼
[FastAPI — SQLite/SQLAlchemy]
```

## 커스텀 Skills

| 커맨드 | 사용 단계 | 용도 |
|--------|-----------|------|
| `/add-page [경로]` | Step 2 | Next.js 페이지 + loading/error 스캐폴딩 |
| `/add-server-filter [파라미터명]` | Step 5, 6 | FastAPI 쿼리 파라미터 + URL 상태 연동 패턴 |

## Hooks

| 이벤트 | 커맨드 | 설명 |
|--------|--------|------|
| PostToolUse (Edit/Write) | `npm --prefix frontend run lint -- --fix` | TypeScript 파일 수정 후 ESLint 자동 실행 |

## 아키텍처 결정

- **필터링·검색은 항상 서버(FastAPI)에서 처리** — 클라이언트 사이드 필터 금지
- **URL 쿼리 파라미터로 필터/검색 상태 관리** — 뒤로 가기, 공유 가능
- **Server Component 기본** — 이벤트 핸들러·상태가 필요한 UI만 `'use client'`
- **route.ts는 CORS 우회 프록시** — 브라우저 fetch는 route.ts 경유, Server Action은 BACKEND_URL 직접 호출
