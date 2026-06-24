# Step 1 — FastAPI CRUD API 구현

## 목표

`backend/main.py`에 SQLite + SQLAlchemy 기반 Todo CRUD API를 완성한다.

## 구현 파일

- `backend/main.py` (전체 수정)
- `backend/requirements.txt` (확인만)

## 구현 내용

### 1. 의존성 및 DB 설정

```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 2. ORM 모델

```python
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### 3. Pydantic 스키마

```python
class TodoCreate(BaseModel):
    title: str

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime
    class Config:
        from_attributes = True
```

### 4. CORS + DB 초기화

```python
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])
Base.metadata.create_all(bind=engine)
```

### 5. CRUD 엔드포인트

Step 1 과제 필수 엔드포인트:

| Method | URL | 설명 | 응답 코드 |
|--------|-----|------|---------|
| GET | `/todos` | 전체 목록 조회 | 200 |
| POST | `/todos` | 생성 | 201 |
| PUT | `/todos/{id}` | 수정 | 200 |
| DELETE | `/todos/{id}` | 삭제 | 200 |

Step 2 편집 페이지(`/todos/[todoId]/page.tsx`)에 필요하므로 선제적으로 추가:

| Method | URL | 설명 | 응답 코드 |
|--------|-----|------|---------|
| GET | `/todos/{id}` | 단일 조회 | 200 |

## 핵심 패턴

- `404` 처리: `db.query(Todo).filter(Todo.id == id).first()` 후 `None`이면 `raise HTTPException(status_code=404)`
- `response_model` 모든 엔드포인트에 명시 필수
- POST는 `status_code=201` 명시

## 검증

1. `backend/` 디렉토리에서 `.venv\Scripts\activate` → `uvicorn main:app --reload`
   - `backend/`에서 실행해야 `todos.db`가 `backend/` 내에 생성됨
2. `http://localhost:8000/docs` 에서 Swagger UI 확인
3. POST `/todos` → body: `{"title": "테스트"}` → 201 응답
4. GET `/todos` → 목록에 생성된 항목 포함 확인
5. PUT `/todos/1` → `{"completed": true}` → 수정 확인
6. DELETE `/todos/1` → 삭제 후 GET 목록에서 제거 확인
