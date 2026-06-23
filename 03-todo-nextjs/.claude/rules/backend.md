---
description: FastAPI + SQLAlchemy 백엔드 규칙. backend/ 디렉토리 작업 시 항상 적용.
paths:
  - backend/**
---

## 코딩 컨벤션

- 모든 request/response에 Pydantic 모델 정의 필수 (타입 없는 dict 반환 금지)
- 환경변수 수정 후 반드시 개발 서버 재시작

## 자주 발생하는 에러

| 에러 | 원인 | 해결 |
|------|------|------|
| `No module named 'fastapi'` | 가상환경 미활성화 | `.venv\Scripts\activate` 실행 |
| `no such table: todos` | 테이블 미생성 | `Base.metadata.create_all(bind=engine)` 확인 |
