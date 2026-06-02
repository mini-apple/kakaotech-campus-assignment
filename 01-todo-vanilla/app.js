// ===== 상태 =====
// 할 일 목록을 배열로 관리. 각 항목은 { id, text, completed, date } 구조
let todoList = [];
// 고유 id 생성을 위한 카운터
let nextId = 1;
// 현재 선택된 필터: 'all' | 'active' | 'completed'
let currentFilter = 'all';
// 현재 선택된 날짜 (Date 객체, 초기값: 오늘)
let currentDate = new Date();
// 주간 뷰에서 보여주는 주의 시작일 (월요일). getMonday는 함수 선언으로 호이스팅됨
let currentWeekStart = getMonday(new Date());
// 로컬스토리지 저장 키
const STORAGE_KEY = 'todo-app-data';

// ===== DOM 요소 참조 =====
const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const todoListEl = document.getElementById('todoList');
const errorMessage = document.getElementById('errorMessage');
const totalCountEl = document.getElementById('totalCount');
const completedCountEl = document.getElementById('completedCount');
const emptyStateEl = document.getElementById('emptyState');
// 주간 뷰
const prevWeekButton = document.getElementById('prevWeekButton');
const nextWeekButton = document.getElementById('nextWeekButton');
const weekRangeLabelEl = document.getElementById('weekRangeLabel');
const weekDaysEl = document.getElementById('weekDays');
// 일간 날짜 네비게이터
const prevDateButton = document.getElementById('prevDateButton');
const nextDateButton = document.getElementById('nextDateButton');
const currentDateLabelEl = document.getElementById('currentDateLabel');
// 필터 탭 버튼 NodeList
const filterTabEls = document.querySelectorAll('.filter-tab');

// ===== 이벤트 바인딩 =====
addButton.addEventListener('click', handleAddTodo);
prevWeekButton.addEventListener('click', moveToPrevWeek);
nextWeekButton.addEventListener('click', moveToNextWeek);
prevDateButton.addEventListener('click', moveToPrevDate);
nextDateButton.addEventListener('click', moveToNextDate);

filterTabEls.forEach((tab) => {
  tab.addEventListener('click', () => setFilter(tab.dataset.filter));
});

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAddTodo();
});

todoInput.addEventListener('input', () => {
  if (todoInput.value.trim() !== '') hideErrorMessage();
});

// ===== 날짜 유틸리티 =====

// Date 객체를 'YYYY-MM-DD' 문자열로 변환 (날짜 비교 기준값)
function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 날짜 네비게이터에 표시할 형식: '2026년 6월 2일 (월)'
function formatDateLabel(date) {
  const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = DAY_NAMES[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${day})`;
}

// 주어진 날짜가 속한 주의 월요일을 반환
function getMonday(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=일, 1=월, ..., 6=토
  // 일요일이면 -6, 그 외는 1-day 만큼 이동해 월요일로 맞춤
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

// 주 시작일(월요일)로부터 월~일 7일치 Date 배열 반환
function getWeekDates(weekStart) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

// 주간 뷰 헤더 레이블 포맷 (크로스 월/년 처리)
// 같은 월: '2026년 6월 2일 - 8일'
// 다른 월: '2026년 5월 26일 - 6월 1일'
// 다른 년: '2025년 12월 29일 - 2026년 1월 4일'
function formatWeekRangeLabel(weekStart) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const sy = weekStart.getFullYear(), sm = weekStart.getMonth() + 1, sd = weekStart.getDate();
  const ey = weekEnd.getFullYear(), em = weekEnd.getMonth() + 1, ed = weekEnd.getDate();
  if (sy === ey && sm === em) return `${sy}년 ${sm}월 ${sd}일 - ${ed}일`;
  if (sy === ey) return `${sy}년 ${sm}월 ${sd}일 - ${em}월 ${ed}일`;
  return `${sy}년 ${sm}월 ${sd}일 - ${ey}년 ${em}월 ${ed}일`;
}

// ===== 주간 뷰 렌더링 =====
function renderWeekView() {
  const weekDates = getWeekDates(currentWeekStart);
  const todayStr = toDateString(new Date());
  const selectedStr = toDateString(currentDate);
  const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];

  weekDaysEl.innerHTML = weekDates.map((date, i) => {
    const dateStr = toDateString(date);
    // 완료되지 않은 Todo 개수만 표시
    const count = todoList.filter((t) => t.date === dateStr && !t.completed).length;
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedStr;

    let cls = 'week-day';
    if (isToday) cls += ' week-day--today';
    if (isSelected) cls += ' week-day--selected';

    return `
      <button class="${cls}" onclick="selectDate('${dateStr}')">
        <span class="week-day__name">${DAY_NAMES[i]}</span>
        <span class="week-day__date">${date.getDate()}</span>
        <span class="week-day__count${count > 0 ? ' week-day__count--has-todos' : ''}">
          ${count > 0 ? `${count}개` : ''}
        </span>
      </button>
    `;
  }).join('');

  weekRangeLabelEl.textContent = formatWeekRangeLabel(currentWeekStart);
}

// ===== 주간 뷰 날짜 셀 클릭 → 날짜 선택 =====
function selectDate(dateStr) {
  // 'YYYY-MM-DD' 파싱 시 UTC 기준 생성을 막기 위해 로컬 시간으로 직접 생성
  const [y, m, d] = dateStr.split('-').map(Number);
  currentDate = new Date(y, m - 1, d);
  updateDateDisplay();
  renderTodoList(); // 내부에서 renderWeekView도 호출
}

// ===== 주 이동 =====
function moveToPrevWeek() {
  const prev = new Date(currentWeekStart);
  prev.setDate(prev.getDate() - 7);
  currentWeekStart = prev;
  renderWeekView();
}

function moveToNextWeek() {
  const next = new Date(currentWeekStart);
  next.setDate(next.getDate() + 7);
  currentWeekStart = next;
  renderWeekView();
}

// currentDate가 현재 주간 뷰 범위를 벗어나면 currentWeekStart를 맞춤
function syncWeekToCurrentDate() {
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const cur = toDateString(currentDate);
  if (cur < toDateString(currentWeekStart) || cur > toDateString(weekEnd)) {
    currentWeekStart = getMonday(currentDate);
  }
}

// ===== 날짜 네비게이터 =====

// 날짜 레이블 갱신 및 오늘 강조 클래스 적용
function updateDateDisplay() {
  const isToday = toDateString(currentDate) === toDateString(new Date());
  currentDateLabelEl.textContent =
    formatDateLabel(currentDate) + (isToday ? ' · 오늘' : '');
  currentDateLabelEl.classList.toggle('date-nav__label--today', isToday);
}

// 하루 이전으로 이동 (주 경계를 넘으면 주간 뷰도 동기화)
function moveToPrevDate() {
  const prev = new Date(currentDate);
  prev.setDate(prev.getDate() - 1);
  currentDate = prev;
  syncWeekToCurrentDate();
  updateDateDisplay();
  renderTodoList();
}

// 하루 다음으로 이동 (주 경계를 넘으면 주간 뷰도 동기화)
function moveToNextDate() {
  const next = new Date(currentDate);
  next.setDate(next.getDate() + 1);
  currentDate = next;
  syncWeekToCurrentDate();
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
  saveTodoList();

  todoInput.value = '';
  hideErrorMessage();
  todoInput.focus();

  renderTodoList();
}

// ===== 할 일 삭제 =====
function deleteTodo(id) {
  // id가 일치하지 않는 항목만 남겨서 삭제 효과
  todoList = todoList.filter((todo) => todo.id !== id);
  saveTodoList();
  renderTodoList();
}

// ===== 완료 토글 =====
function toggleComplete(id) {
  todoList = todoList.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodoList();
  renderTodoList();
}

// ===== 수정 시작: 텍스트를 인라인 입력창으로 전환 =====
function startEdit(id) {
  const todo = todoList.find((t) => t.id === id);
  if (!todo) return;

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

  todoItemEl.replaceChild(editInput, textEl);

  // 버튼을 저장/취소로 교체
  actionsEl.innerHTML = `
    <button class="btn btn--save" onclick="saveEdit(${id})">저장</button>
    <button class="btn btn--edit" onclick="cancelEdit(${id})">취소</button>
  `;

  // 커서를 텍스트 끝으로
  editInput.focus();
  editInput.setSelectionRange(editInput.value.length, editInput.value.length);

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

  todoList = todoList.map((todo) =>
    todo.id === id ? { ...todo, text: newText } : todo
  );
  saveTodoList();
  renderTodoList();
}

// ===== 수정 취소: 원래 상태로 복원 =====
function cancelEdit(id) {
  renderTodoList();
}

// ===== 로컬스토리지 저장 =====
// todoList 배열과 nextId를 JSON으로 직렬화하여 저장
function saveTodoList() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ todoList, nextId }));
}

// ===== 로컬스토리지 불러오기 =====
// 저장된 데이터가 있으면 todoList와 nextId를 복원
function loadTodoList() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  const { todoList: savedList, nextId: savedNextId } = JSON.parse(saved);
  todoList = savedList;
  nextId = savedNextId;
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
  // 할 일 변경/날짜 변경 시 주간 뷰의 날짜별 개수와 선택 상태도 함께 갱신
  renderWeekView();

  const filteredList = getFilteredTodoList();

  if (filteredList.length === 0) {
    emptyStateEl.textContent = EMPTY_STATE_MESSAGE[currentFilter];
    todoListEl.appendChild(emptyStateEl);
    return;
  }

  filteredList.forEach((todo) => {
    todoListEl.appendChild(createTodoItemElement(todo));
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

// ===== 초기화: 로컬스토리지 복원 후 렌더링 =====
loadTodoList();
updateDateDisplay();
renderTodoList(); // 내부에서 renderWeekView도 호출됨
