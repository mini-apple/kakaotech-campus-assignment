# kakaotech-campus-assignment

카카오테크 캠퍼스 1차 프리코스 과제 저장소입니다.

---

## 과제 목록

### 1차 과제 — Vanilla JS Todo 앱 ([01-todo-vanilla](./01-todo-vanilla))

HTML / CSS / Vanilla JS만 사용하여 구현한 Todo 앱입니다.

- Todo CRUD (추가 / 수정 / 삭제 / 완료 토글)
- 상태별 필터링 (전체 / 진행 중 / 완료)
- 일간 뷰 (날짜 네비게이터)
- localStorage 데이터 유지
- 주간 뷰 (7일 그리드, 미완료 개수 뱃지)

---

### 2차 과제 — React Todo 앱 ([02-todo-react](./02-todo-react))

1차 과제를 React + Vite + Tailwind CSS v4로 마이그레이션한 프로젝트입니다.

- 1차 과제와 동일한 기능 구현
- 컴포넌트 기반 설계 (`src/components/`)
- 커스텀 훅으로 상태 분리 (`useTodo`)

---

### 3차 과제 — Next.js Todo 앱 ([03-todo-nextjs](./03-todo-nextjs))

2차 과제를 Next.js (App Router) + FastAPI 백엔드로 재구현한 프로젝트입니다.

- **백엔드**: FastAPI + SQLAlchemy + SQLite (RESTful CRUD API)
- Todo CRUD (추가 / 수정 페이지 / 삭제 / 완료 토글)
- 상태별 필터링 (전체 / 진행 중 / 완료) — 서버 기반
- 키워드 검색 (LIKE 검색, 300ms 디바운스) — 서버 기반
- 주간 뷰 (7일 그리드, 날짜별 미완료 count 배지)
- URL 기반 상태 관리 (`?date=`, `?filter=`, `?search=`)
- Server Component / Client Component 분리
- API Route 프록시 (`/api/todos`) — CORS 우회
- 환경변수로 백엔드 URL 관리 (`.env.local`)
