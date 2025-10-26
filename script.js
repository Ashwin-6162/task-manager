const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const progressList = document.getElementById('progressList');
const doneList = document.getElementById('doneList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || {
  todo: [],
  inprogress: [],
  done: []
};

// --------------------- Add Task ---------------------
addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (!text) return alert("Enter a task!");
  const task = { id: Date.now(), text };
  tasks.todo.push(task);
  taskInput.value = '';
  saveAndRender();
});

// --------------------- Render Function ---------------------
function render() {
  todoList.innerHTML = '';
  progressList.innerHTML = '';
  doneList.innerHTML = '';

  Object.keys(tasks).forEach(status => {
    tasks[status].forEach(task => {
      const div = document.createElement('div');
      div.className = 'task';
      div.draggable = true;
      div.id = task.id;
      div.ondragstart = drag;

      const span = document.createElement('span');
      span.textContent = task.text;

      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.textContent = 'X';
      del.onclick = () => deleteTask(status, task.id);

      div.append(span, del);

      if (status === 'todo') todoList.appendChild(div);
      else if (status === 'inprogress') progressList.appendChild(div);
      else doneList.appendChild(div);
    });
  });
}

// --------------------- Drag & Drop ---------------------
function allowDrop(e) {
  e.preventDefault();
}

function drag(e) {
  e.dataTransfer.setData('id', e.target.id);
}

function drop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData('id');
  const newStatus = e.currentTarget.id;

  let found;
  Object.keys(tasks).forEach(status => {
    const index = tasks[status].findIndex(t => t.id == id);
    if (index > -1) {
      found = tasks[status][index];
      tasks[status].splice(index, 1);
    }
  });

  if (found) tasks[newStatus].push(found);
  saveAndRender();
}

// --------------------- Delete ---------------------
function deleteTask(status, id) {
  tasks[status] = tasks[status].filter(t => t.id !== id);
  saveAndRender();
}

// --------------------- Save & Render ---------------------
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

render();
