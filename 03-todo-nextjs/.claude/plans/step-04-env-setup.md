# Step 4 — 환경변수 설정

## 목표

프론트엔드와 백엔드의 환경변수 파일을 생성하고, 서버 기동 전 환경변수가 올바르게 주입되는지 확인한다.

## 구현 파일

| 파일 | 비고 |
|------|------|
| `frontend/.env.local` | 생성 (gitignore됨) |
| `backend/.env.local` | 선택 사항 (SQLite 기본값 사용 시 불필요) |

## 환경변수 내용

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
BACKEND_URL=http://localhost:8000
```

```bash
# backend/.env.local (선택)
DATABASE_URL=sqlite:///./todos.db
```

## 핵심 규칙

| 변수 | 접근 위치 | 규칙 |
|------|-----------|------|
| `NEXT_PUBLIC_API_URL` | 브라우저 + 서버 | `NEXT_PUBLIC_` 접두사 필수 |
| `BACKEND_URL` | 서버(Next.js)만 | 브라우저에 노출 안됨, `NEXT_PUBLIC_` 없음 |

- `BACKEND_URL`은 actions.ts, route.ts에서만 사용 (`process.env.BACKEND_URL`)
- 브라우저에서 직접 FastAPI를 호출하는 코드 작성 금지

## 검증

1. `frontend/.gitignore`에 `.env.local`이 포함되어 있는지 확인
2. `frontend/.env.local` 파일 존재 확인
3. Next.js 개발 서버 재시작 (`npm run dev`)
4. `http://localhost:3000/todos` — CORS 에러 없이 데이터 로드 확인
5. 에러 발생 시: `Failed to parse URL from undefined` → `.env.local` 재확인 후 서버 재시작
