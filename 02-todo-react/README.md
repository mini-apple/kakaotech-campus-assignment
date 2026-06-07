# 02-todo-react

카카오테크 캠퍼스 1차 과제(Vanilla JS Todo 앱)를 React로 마이그레이션한 프로젝트입니다.

## 기술 스택

- **React 19** — 컴포넌트 기반 UI
- **Vite** — 빌드 도구 및 개발 서버
- **Tailwind CSS v4** — 유틸리티 기반 스타일링

## 시작하기

```bash
npm install
npm run dev
```

개발 서버는 `http://localhost:5173`에서 실행됩니다.

---

## 구현 기능

### 1. 기본 Todo CRUD

- 텍스트 입력 후 **추가 버튼** 또는 **Enter** 키로 할 일 생성
- 입력값이 비어있으면 에러 메시지 표시, 할 일 생성 차단
- 생성된 할 일은 카드 형태의 목록으로 표시
- 각 항목에서 **완료 처리 / 수정 / 삭제** 가능
- 완료 처리된 항목은 취소선으로 시각적 구분
- 수정은 `prompt()` 대신 **인라인 입력창**으로 전환 (Enter 저장 / ESC 취소)
- 완료된 항목은 수정 버튼 비활성화

### 2. 상태별 필터링

- **전체 / 진행 중 / 완료** 탭으로 원하는 할 일만 표시
- 선택된 탭은 흰 배경 + 보라색 텍스트로 시각적 강조
- 필터 상태는 `useState`로 관리하며, 탭 전환 후 새 할 일 추가 시에도 필터 유지
- 목록 상단에 **전체 / 완료 카운트 배지** 표시

### 3. 일간 뷰 (날짜 네비게이터)

- 현재 선택된 날짜 표시 (`오늘` 레이블 포함)
- 이전 / 다음 버튼으로 날짜 이동
- 선택된 날짜에 해당하는 할 일만 표시
- 새 할 일은 현재 선택된 날짜(`YYYY-MM-DD`)로 자동 저장

### 4. localStorage 연동

- 할 일 추가 / 수정 / 삭제 시 자동으로 localStorage에 저장
- 새로고침 후에도 데이터 유지
- `useEffect`로 `todoList`, `nextId` 변경 시 자동 저장
- `useState` 초기화 함수로 마운트 시 한 번만 데이터 복원

### 5. 주간 뷰

- 이번 주 월~일 7일 날짜 표시 (7칸 그리드)
- 날짜 셀 클릭 시 해당 날짜로 이동 (일간 뷰와 연동)
- 이전 주 / 다음 주 이동 버튼
- 각 날짜 아래에 **미완료 할 일 개수** 뱃지 표시
- 오늘 날짜: 보라색 원형 강조
- 선택된 날짜: 연보라 배경 강조
- DateNavigator로 주 경계를 넘으면 주간 뷰도 자동 동기화
- 선택된 주차는 localStorage에 저장되어 새로고침 후에도 유지

---

## 파일 구조

```
src/
├── components/
│   ├── TodoInput.jsx       # 입력 폼 + 에러 메시지
│   ├── TodoList.jsx        # 목록 컨테이너 + 카운트 배지 + 빈 상태
│   ├── TodoItem.jsx        # 개별 항목 (완료토글 / 인라인 수정 / 삭제)
│   ├── FilterTabs.jsx      # 전체 / 진행 중 / 완료 필터 탭
│   ├── DateNavigator.jsx   # 날짜 이동 네비게이터
│   └── WeekView.jsx        # 주간 뷰 그리드
├── hooks/
│   └── useTodo.js          # 전체 상태 및 CRUD 로직
├── utils/
│   └── dateUtils.js        # 날짜 포맷 / 주 계산 유틸 함수
├── App.jsx
├── main.jsx
└── index.css               # Tailwind 진입점 + 전역 스타일
```

---

## Vanilla JS와의 비교

| 항목 | Vanilla JS | React |
|------|-----------|-------|
| 상태 관리 | 전역 변수 (`let todoList = []`) | `useState` |
| DOM 업데이트 | 직접 조작 (`innerHTML`, `classList`) | 상태 변경 → 자동 재렌더링 |
| 수정 UI | `prompt()` 팝업 | `isEditing` 상태로 인라인 전환 |
| 필터링 | `display: none`으로 DOM 숨김 | 배열 필터링 후 재렌더링 |
| localStorage | 함수마다 `setItem()` 직접 호출 | `useEffect` 하나로 자동 저장 |
