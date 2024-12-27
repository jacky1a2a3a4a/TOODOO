// DOM elements
const accountName = document.querySelector('.account-name');
//greeting
const nameInput = document.querySelector('#user-name');

//提交form
const newTodoForm = document.querySelector('#new-todo-form');
// 提交內容
const todoInput = document.querySelector('#todo-content');

//todo list
const todoList = document.querySelector('.task-list');
const tabs = document.querySelector('.tabs');
const clearAllBtn = document.querySelector('.clear-all-btn');
const sortButtons = document.querySelector('.sort-buttons');
const taskBg = document.querySelector('.task-clear-container');

// localStorage
const nickname = localStorage.getItem('nickname');
const userName = localStorage.getItem('userName') || '';
const todos = JSON.parse(localStorage.getItem('todos')) || [];

//替換navbar nickname
if (nickname) {
  accountName.innerHTML = nickname;
}

// 渲染userName
function renderUserName() {
  nameInput.value = userName;

  nameInput.addEventListener('change', (e) => {
    localStorage.setItem('userName', e.target.value);
  });
}

// 驗證輸入
function checkNewTodo() {
  // 不能放在全域變數，因為每次提交時需要的是當下的值，每次提交都會觸發函式，獲取當下輸入的值
  const content = todoInput.value.trim();
  const categorySelected = document.querySelector(
    'input[name="category"]:checked',
  );

  if (!content) {
    showCustomAlert('👉 Please Key in a todo.');
    return false;
  }

  if (!categorySelected) {
    showCustomAlert('👉 Please choose a category.');
    return false;
  }

  // 回傳驗證成功後的資料;
  return {
    content: content,
    categorySelected: categorySelected,
  };
}

// 新增todo
function keyNewTodo() {
  const validatedData = checkNewTodo(); // 接收驗證後的資料
  if (!validatedData) return;

  const todo = {
    content: validatedData.content, // 使用驗證後的 content
    category: validatedData.categorySelected.value, // 使用驗證後的 category
    done: false,
    createdAt: new Date().getTime(),
  };

  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));

  displayTodos();
}

//渲染todo list
let currentFilter = 'all';

function displayTodos() {
  todoList.innerHTML = '';

  // 隱藏圖片
  if (todos.length === 0) {
    taskBg.classList.remove('hidden');
  } else {
    taskBg.classList.add('hidden');
  }

  //根據條件過濾todos
  let filteredTodos = todos.filter((todo) => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'progressing') return !todo.done;
    if (currentFilter === 'completed') return todo.done;
  });

  //排序數據
  filteredTodos = sortTodos(filteredTodos, currentSort);

  filteredTodos.forEach((todo, index) => {
    // 找到當前 todo 在原始 todos 數組中的索引
    const originalIndex = todos.findIndex(
      (t) =>
        t.content === todo.content &&
        t.category === todo.category &&
        t.createdAt === todo.createdAt,
    );

    todoList.innerHTML += `
    <div 
    class="task ${todo.done ? 'completed' : ''}" 
    data-index="${originalIndex}"
    >
    <input class="task-checkbox" type="checkbox"
    ${todo.done ? 'checked' : ''}
    />
    <div class="task-list-tag ${todo.category}">${todo.category}</div>
    <input
      class="task-content"
      type="text"
      value="${todo.content}"
      readonly
    />
    <div class="edit-btn">✎</div>
    <div class="remove-btn">✕</div>
  </div>
  `;
  });

  todoList.innerHTML += `
  <div class="footer">
    <span><span class="task-count">
    ${todos.filter((todo) => !todo.done).length}
    </span> tasks progressing</span>
     <span class="clear-all-btn">clear all completed</span>
  </div>
  `;
}

//添加刪除線
function toggleTask(index) {
  //切換狀態
  todos[index].done = !todos[index].done;

  //更新localstorage
  localStorage.setItem('todos', JSON.stringify(todos));

  //馬上渲染畫面
  displayTodos();
}

//刪除按鈕
function removeTodo(taskItem, index) {
  taskItem.classList.add('slide-up');

  // 等待動畫結束後再移除
  setTimeout(() => {
    todos.splice(index, 1);

    //更新localstorage
    localStorage.setItem('todos', JSON.stringify(todos));

    //馬上渲染畫面
    displayTodos();
  }, 200); // 與 CSS 中的 transition 時間一致
}

//編輯按鈕
function editTodo(taskItem, index) {
  const taskContent = taskItem.querySelector('.task-content');
  // 移除只讀屬性，讓使用者可以編輯
  taskContent.removeAttribute('readonly');
  // 聚焦於文字框
  taskContent.focus();

  taskContent.addEventListener('blur', () => {
    const updateContent = taskContent.value.trim();

    if (updateContent) {
      todos[index].content = updateContent;
      localStorage.setItem('todos', JSON.stringify(todos));
    } else {
      alert('Todo cannot be empty.');
    }
  });

  taskContent.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // 模擬 blur 行為
      taskContent.blur();
    }
  });
}

//刪除全部按鈕
function clearAllCompleted() {
  const todosProgressing = todos.filter((todo) => !todo.done);

  //透過長度歸零來清空陣列
  todos.length = 0;
  //filter回傳的是陣列，需要展開來再push
  todos.push(...todosProgressing);

  // 更新localstorage
  localStorage.setItem('todos', JSON.stringify(todos));

  displayTodos();
}

//排序按鈕
//預設為最新牌序
let currentSort = 'latest';

const categoryOrder = {
  business: 1,
  personal: 2,
  travel: 3,
  study: 4,
};

function sortTodos(todos, sortType) {
  const sortTodos = [...todos]; // 複製數據以避免改變原始數據

  switch (sortType) {
    case 'category':
      return sortTodos.sort((a, b) => {
        const categoryDiff =
          categoryOrder[a.category] - categoryOrder[b.category];
        if (categoryDiff !== 0) return categoryDiff; // 按類別排序
        return b.createdAt - a.createdAt; // 如果類別相同，按時間倒序
      });

    case 'latest':
      //按醉心時間排序
      return sortTodos.sort((a, b) => b.createdAt - a.createdAt);

    case 'oldest':
      return sortTodos.sort((a, b) => a.createdAt - b.createdAt);

    default:
      // 如果找不到匹配的排序方式，返回原數據
      return sortTodos;
  }
}

//eventListener
//add todo
newTodoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  keyNewTodo();
  e.target.reset();
});

//tabs 點擊
tabs.addEventListener('click', (e) => {
  const tab = e.target;
  if (!tab.classList.contains('tab')) {
    return;
  }

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.remove('active');
  });

  tab.classList.add('active');

  //更新篩選條件 > 現在點擊到的dataset
  currentFilter = tab.dataset.filter;

  displayTodos();
});

//todo list點擊
todoList.addEventListener('click', (e) => {
  if (e.target.classList.contains('clear-all-btn')) {
    const todosCompleted = todos.some((todo) => todo.done);

    if (!todosCompleted) {
      showCustomAlert('🛬 All todo is progressing.');
    }

    if (todosCompleted) {
      showCustomConfirm((confirmed) => {
        if (confirmed) {
          clearAllCompleted(); // 確認後執行刪除操作
        }
      });
    }

    return;
  }

  const taskItem = e.target.closest('.task');
  if (!taskItem) {
    return;
  }
  const index = taskItem.dataset.index;

  if (e.target.classList.contains('remove-btn')) {
    removeTodo(taskItem, index);
    return;
  }

  if (e.target.classList.contains('edit-btn')) {
    editTodo(taskItem, index);
    return;
  }

  toggleTask(index);
});

//排序按鈕 點擊(change不會重複渲染)
sortButtons.addEventListener('change', (e) => {
  if (e.target.type === 'radio') {
    currentSort = e.target.value; // 更新排序方式
    displayTodos();
  }
});

// 載入頁面
window.addEventListener('load', () => {
  renderUserName();
  // 預設為最新排序
  document.getElementById('sort-latest').checked = true;
  currentSort = 'latest';
  displayTodos();
});

//logout
const apiUrl = 'https://todoo.5xcamp.us';
const logoutBtn = document.querySelector('.logout-btn');

function logout() {
  const token = localStorage.getItem('Authorization');
  axios.defaults.headers.common['Authorization'] = token;

  axios
    .delete(`${apiUrl}/users/sign_out`)
    .then((res) => {
      // 清空 localStorage
      localStorage.removeItem('Authorization');
      localStorage.removeItem('nickname');
      localStorage.removeItem('userName');

      // 清空 axios headers
      axios.defaults.headers.common['Authorization'] = null;

      alert('Logout successful! Now will return to login page.')
      window.location.href = '/pages/Login/login.html';
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
}

logoutBtn.addEventListener('click', (e) => {
  logout();
});
