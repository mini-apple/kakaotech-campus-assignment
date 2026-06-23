---
name: add-api
description: FastAPI 엔드포인트 + Next.js route.ts 프록시 + actions.ts 함수 3개 파일 동시 스캐폴딩. 새 API 기능 추가 시 사용.
disable-model-invocation: true
---

# /add-api [엔드포인트]

`$ARGUMENTS`에 엔드포인트 이름(예: `todos`, `tags`)을 받아 아래 3개 파일을 동시에 스캐폴딩한다.

## 1. backend/main.py — FastAPI 라우터 추가

`$ARGUMENTS` 이름으로 Pydantic 모델(Create/Update/Response) + CRUD 라우터를 추가한다.

필수 패턴:
- Request/Response 각각 별도 Pydantic 모델 정의 (`Create`, `Update`, `Response` 접미어 사용)
- SQLAlchemy ORM 모델 추가 (기존 `Base`, `engine`, `SessionLocal` 재사용)
- 의존성 주입: `Depends(get_db)` 사용
- 모든 라우터에 `response_model` 명시

```python
# 예시 스키마 패턴
class {Name}Create(BaseModel):
    ...

class {Name}Response(BaseModel):
    id: int
    ...
    class Config:
        from_attributes = True

# 예시 라우터 패턴
@app.get("/{endpoint}", response_model=list[{Name}Response])
def list_{endpoint}(db: Session = Depends(get_db)):
    ...
```

## 2. frontend/app/api/[endpoint]/route.ts — Next.js 프록시 라우터

`BACKEND_URL` 환경변수로 FastAPI에 요청을 전달하는 프록시 핸들러를 생성한다.

필수 패턴:
- `BACKEND_URL` 환경변수 사용 (하드코딩 금지)
- GET, POST, PUT, DELETE 메서드별 export 함수 작성
- `NextRequest`, `NextResponse` 타입 사용
- TypeScript `any` 금지 — 요청/응답 타입 정의

```typescript
// frontend/app/api/{endpoint}/route.ts
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const res = await fetch(`${BACKEND_URL}/{endpoint}?${searchParams}`)
  const data = await res.json()
  return NextResponse.json(data)
}
```

## 3. frontend/app/actions.ts — Server Action 함수 추가

기존 `actions.ts`에 FastAPI를 직접 호출하는 Server Action 함수를 추가한다.

필수 패턴:
- `'use server'` 선언 (파일 최상단 또는 함수 상단)
- `BACKEND_URL` 환경변수 사용
- `revalidatePath()` 호출로 캐시 무효화
- TypeScript 타입 정의 (interface 또는 type alias)

```typescript
// 추가 패턴
export async function create{Name}(data: {Name}Create) {
  'use server'
  const res = await fetch(`${process.env.BACKEND_URL}/{endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  revalidatePath('/{endpoint}')
  return res.json()
}
```

## 실행 후 체크리스트

- [ ] `backend/main.py`에 Pydantic 모델 3개(Create, Update, Response) 추가됨
- [ ] `backend/main.py`에 SQLAlchemy ORM 모델 추가됨
- [ ] `frontend/app/api/{endpoint}/route.ts` 생성됨
- [ ] `frontend/app/actions.ts`에 CRUD 함수 추가됨
- [ ] TypeScript `any` 없음
- [ ] 환경변수 하드코딩 없음
