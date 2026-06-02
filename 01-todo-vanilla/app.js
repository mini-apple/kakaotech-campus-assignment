// ===== 상태 =====
// 할 일 목록을 배열로 관리. 각 항목은 { id, text, completed, date } 구조
let todoList = [];
// 고유 id 생성을 위한 카운터
let nextId = 1;
// 현재 선택된 필터: 'all' | 'active' | 'completed'
let currentFilter = 'all';
// 현재 선택된 날짜 (Date 객체, 초기값: 오늘)
let currentDate = new Date();

// ===== DOM 요소 참조 =====
const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const todoListEl = document.getElementById('todoList');
const errorMessage = document.getElementById('errorMessage');
const totalCountEl = document.getElementById('totalCount');
const completedCountEl = document.getElementById('completedCount');
const emptyStateEl = document.getElementById('emptyState');
// 날짜 네비게이터
const prevDateButton = document.getElementById('prevDateButton');
const nextDateButton = document.getElementById('nextDateButton');
const currentDateLabelEl = document.getElementById('currentDateLabel');
// 필터 탭 버튼 NodeList
const filterTabEls = document.querySelectorAll('.filter-tab');

// ===== 이벤트 바인딩 =====
addButton.addEventListener('click', handleAddTodo);
prevDateButton.addEventListener('click', moveToPrevDate);
nextDateButton.addEventListener('click', moveToNextDate);

// 각 필터 탭 클릭 시 해당 필터로 전환
filterTabEls.forEach((tab) => {
  tab.addEventListener('click', () => {
    setFilter(tab.dataset.filter);
  });
});

// Enter 키로도 할 일 추가 가능
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAddTodo();
});

// 입력 중 에러 메시지 자동 숨김
todoInput.addEventListener('input', () => {
  if (todoInput.value.trim() !== '') {
    hideErrorMessage();
  }
});

// ===== 날짜 유틸리티 =====

// Date 객체를 'YYYY-MM-DD' 문자열로 변환 (날짜 비교 기준값)
function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 날짜 네비게이터에 표시할 형식으로 포맷 ('2026년 6월 2일 (월)')
function formatDateLabel(date) {
  const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = DAY_NAMES[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${day})`;
}

// ===== 날짜 네비게이션 =====

// 날짜 표시 갱신: 레이블 텍스트 및 오늘 강조 클래스 적용
function updateDateDisplay() {
  const isToday = toDateString(currentDate) === toDateString(new Date());
  currentDateLabelEl.textContent =
    formatDateLabel(currentDate) + (isToday ? ' · 오늘' : '');
  currentDateLabelEl.classList.toggle('date-nav__label--today', isToday);
}

// 하루 이전으로 이동
function moveToPrevDate() {
  const prev = new Date(currentDate);
  prev.setDate(prev.getDate() - 1);
  currentDate = prev;
  updateDateDisplay();
  renderTodoList();
}

// 하루 다음으로 이동
function moveToNextDate() {
  const next = new Date(currentDate);
  next.setDate(next.getDate() + 1);
  currentDate = next;
  updateDateDisplay();
  renderTodoList();
}

// ===== 할 일 추가 =====
function handleAddTodo() {
  const text = todoInput.value.trim();

  // 빈 입력값 검사
  if (text === '') {
    showErrorMessage();
    todoInput.focus();
    return;
  }

  // 새 할 일 객체 생성 (현재 선택된 날짜를 함께 저장)
  const newTodo = {
    id: nextId++,
    text,
    completed: false,
    date: toDateString(currentDate),
  };

  todoList.push(newTodo);

  // 입력창 초기화
  todoInput.value = '';
  hideErrorMessage();
  todoInput.focus();

  renderTodoList();
}

// ===== 할 일 삭제 =====
function deleteTodo(id) {
  // id가 일치하지 않는 항목만 남겨서 삭제 효과
  todoList = todoList.filter((todo) => todo.id !== id);
  renderTodoList();
}

// ===== 완료 토글 =====
function toggleComplete(id) {
  todoList = todoList.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  renderTodoList();
}

// ===== 수정 시작: 텍스트를 인라인 입력창으로 전환 =====
function startEdit(id) {
  const todo = todoList.find((t) => t.id === id);
  if (!todo) return;

  // 해당 항목의 li 요소를 찾아 수정 모드 UI로 교체
  const todoItemEl = document.querySelector(`[data-id="${id}"]`);
  if (!todoItemEl) return;

  const textEl = todoItemEl.querySelector('.todo-item__text');
  const actionsEl = todoItemEl.querySelector('.todo-item__actions');

  // 인라인 수정 input 생성
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'todo-item__edit-input';
  editInput.value = todo.text;
  editInput.maxLength = 100;

  // 기존 텍스트 요소를 input으로 교체
  todoItemEl.replaceChild(editInput, textEl);

  // 버튼을 저장/취소로 교체
  actionsEl.innerHTML = `
    <button class="btn btn--save" onclick="saveEdit(${id})">저장</button>
    <button class="btn btn--edit" onclick="cancelEdit(${id})">취소</button>
  `;

  // input에 포커스 및 커서를 텍스트 끝으로
  editInput.focus();
  editInput.setSelectionRange(editInput.value.length, editInput.value.length);

  // Enter로 저장, Escape로 취소
  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveEdit(id);
    if (e.key === 'Escape') cancelEdit(id);
  });
}

// ===== 수정 저장 =====
function saveEdit(id) {
  const todoItemEl = document.querySelector(`[data-id="${id}"]`);
  if (!todoItemEl) return;

  const editInput = todoItemEl.querySelector('.todo-item__edit-input');
  const newText = editInput.value.trim();

  // 빈 값으로 저장 방지
  if (newText === '') {
    editInput.focus();
    return;
  }

  // 상태 업데이트
  todoList = todoList.map((todo) =>
    todo.id === id ? { ...todo, text: newText } : todo
  );

  renderTodoList();
}

// ===== 수정 취소: 원래 상태로 복원 =====
function cancelEdit(id) {
  renderTodoList();
}

// ===== 필터 전환 =====
function setFilter(filter) {
  currentFilter = filter;

  // 탭 버튼의 active 클래스를 선택된 탭에만 적용
  filterTabEls.forEach((tab) => {
    tab.classList.toggle('filter-tab--active', tab.dataset.filter === filter);
  });

  renderTodoList();
}

// ===== 에러 메시지 표시/숨김 =====
function showErrorMessage() {
  errorMessage.classList.remove('hidden');
}

function hideErrorMessage() {
  errorMessage.classList.add('hidden');
}

// ===== 카운트 뱃지 업데이트 =====
// 선택된 날짜 기준으로 전체/완료 수를 계산
function updateCountBadges() {
  const dateTodos = todoList.filter((t) => t.date === toDateString(currentDate));
  const total = dateTodos.length;
  const completed = dateTodos.filter((t) => t.completed).length;

  totalCountEl.textContent = `전체 ${total}`;
  completedCountEl.textContent = `완료 ${completed}`;
}

// ===== 현재 날짜 + 상태 필터에 맞는 할 일 목록 반환 =====
function getFilteredTodoList() {
  // 1단계: 선택된 날짜에 해당하는 항목만 추출
  const dateTodos = todoList.filter((t) => t.date === toDateString(currentDate));

  // 2단계: 상태 필터 적용
  if (currentFilter === 'active') return dateTodos.filter((t) => !t.completed);
  if (currentFilter === 'completed') return dateTodos.filter((t) => t.completed);
  return dateTodos; // 'all'
}

// 필터별 빈 상태 안내 메시지
const EMPTY_STATE_MESSAGE = {
  all: '등록된 할 일이 없습니다.',
  active: '진행 중인 할 일이 없습니다.',
  completed: '완료된 할 일이 없습니다.',
};

// ===== 전체 목록 렌더링 =====
function renderTodoList() {
  todoListEl.innerHTML = '';

  updateCountBadges();

  const filteredList = getFilteredTodoList();

  // 필터 결과가 없으면 현재 필터에 맞는 빈 상태 메시지 표시
  if (filteredList.length === 0) {
    emptyStateEl.textContent = EMPTY_STATE_MESSAGE[currentFilter];
    todoListEl.appendChild(emptyStateEl);
    return;
  }

  // 각 할 일 항목을 li 요소로 생성하여 목록에 추가
  filteredList.forEach((todo) => {
    const li = createTodoItemElement(todo);
    todoListEl.appendChild(li);
  });
}

// ===== 개별 할 일 항목 요소 생성 =====
function createTodoItemElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.completed ? ' todo-item--completed' : ''}`;
  // data-id 속성으로 항목 식별
  li.dataset.id = todo.id;

  li.innerHTML = `
    <span class="todo-item__text">${escapeHtml(todo.text)}</span>
    <div class="todo-item__actions">
      <button class="btn btn--complete${todo.completed ? ' active' : ''}"
              onclick="toggleComplete(${todo.id})">
        ${todo.completed ? '완료됨' : '완료'}
      </button>
      <button class="btn btn--edit"
              onclick="startEdit(${todo.id})"
              ${todo.completed ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>
        수정
      </button>
      <button class="btn btn--delete" onclick="deleteTodo(${todo.id})">삭제</button>
    </div>
  `;

  return li;
}

// ===== XSS 방지용 HTML 이스케이프 =====
// 사용자 입력 텍스트를 innerHTML에 삽입할 때 특수문자를 이스케이프
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// ===== 초기 렌더링 =====
updateDateDisplay();
renderTodoList();
