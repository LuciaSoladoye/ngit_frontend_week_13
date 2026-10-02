const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompleted = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function saveTasks() { localStorage.setItem('tasks', JSON.stringify(tasks)); }
function renderTasks() {
    taskList.innerHTML = '';
    let filtered = tasks.filter(t => {
        if (filter === 'active') return!t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    });
    filtered.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${task.completed? 'checked' : ''} onchange="toggleTask(${index})">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        `;
        taskList.appendChild(li);
    });
    taskCount.textContent = `${tasks.filter(t =>!t.completed).length} tasks left`;
    saveTasks();
}
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    tasks.push({ text, completed: false });
    taskInput.value = '';
    renderTasks();
}
function toggleTask(i) { tasks[i].completed =!tasks[i].completed; renderTasks(); }
function deleteTask(i) { tasks.splice(i, 1); renderTasks(); }

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); });
clearCompleted.addEventListener('click', () => {
    tasks = tasks.filter(t =>!t.completed);
    renderTasks();
});
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filter = btn.dataset.filter;
        renderTasks();
    });
});
renderTasks();
