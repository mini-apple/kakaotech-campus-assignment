# Todo App — Next.js + FastAPI

## 실행 방법

```bash
# 백엔드 (backend/)
.venv\Scripts\activate
uvicorn main:app --reload      # http://localhost:8000
                               # API 문서: http://localhost:8000/docs

# 프론트엔드 (frontend/)
npm run dev                    # http://localhost:3000
```

## 디렉토리 구조

```
03-todo-nextjs/
├── frontend/
│   └── app/
│       ├── api/todos/route.ts      # FastAPI 프록시 (외부 HTTP 전달)
│       ├── todos/
│       │   ├── [todoId]/page.tsx   # Todo 수정 페이지
│       │   ├── new/page.tsx        # Todo 생성 페이지
│       │   ├── error.tsx
│       │   ├── loading.tsx
│       │   └── page.tsx            # Todo 목록 페이지
│       ├── actions.ts              # Server Actions (서버에서 직접 FastAPI 호출)
│       └── layout.tsx / page.tsx
└── backend/
    └── main.py                     # FastAPI 앱 전체 (라우터 + DB + 모델 + 스키마)
```

## 환경변수

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
BACKEND_URL=http://localhost:8000

# backend/.env.local
DATABASE_URL=sqlite:///./todos.db
```

## API 엔드포인트 (FastAPI — localhost:8000)

| Method | URL | 설명 |
|--------|-----|------|
| GET | `/todos` | 전체 목록 조회 |
| GET | `/todos?filter=active` | 진행 중 필터 |
| GET | `/todos?filter=completed` | 완료 필터 |
| GET | `/todos?search=키워드` | 키워드 검색 |
| GET | `/todos?filter=active&search=키워드` | 필터 + 검색 |
| POST | `/todos` | Todo 생성 |
| PUT | `/todos/{id}` | Todo 수정 |
| DELETE | `/todos/{id}` | Todo 삭제 |

@.claude/rules/frontend.md
@.claude/rules/backend.md

## Hooks

`.claude/settings.json`에 정의된 자동 실행 커맨드.

| 이벤트 | 트리거 | 커맨드 | 설명 |
|--------|--------|--------|------|
| PostToolUse | Edit / Write | `npm --prefix frontend run lint -- --fix` | 파일 수정 후 ESLint 자동 실행 |

## 커스텀 Skills

`.claude/skills/`에 정의됨. `/skill-name [인수]`로 호출.

### `/add-server-filter [파라미터명]`
서버 기반 필터·검색 추가 시 사용 (Step 5, 6). 4곳 동시 수정:
- `backend/main.py` — `Optional[str]` 쿼리 파라미터 + SQLAlchemy filter
- `frontend/app/api/todos/route.ts` — searchParams 전달 확인
- `frontend/app/actions.ts` — 파라미터 포함 fetch URL
- `frontend/app/todos/page.tsx` — searchParams prop 읽기 + `<Suspense>`

### `/add-page [경로]`
새 페이지 추가 시 사용. Next.js App Router 구조 스캐폴딩:
- `frontend/app/[경로]/page.tsx` — Server Component (기본값)
- `frontend/app/[경로]/loading.tsx` + `error.tsx`
- `useSearchParams()` 사용 시 `<Suspense>` 자동 포함

## Plan Mode 권장 상황

복잡한 작업 전에 `/plan`으로 설계를 먼저 확인할 것:
- 새 API 엔드포인트 + 연동 컴포넌트 동시 추가
- Server Action vs route.ts 중 어디에 로직을 둘지 판단이 필요할 때
- DB 스키마 변경
