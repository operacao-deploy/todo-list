import { addTask } from './tasks.js';

const form = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-title');
const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('#task-count');
const emptyState = document.querySelector('#empty-state');
const message = document.querySelector('#message');


let tasks = [];


function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('error', isError);
}

function render() {
  taskList.replaceChildren();
  const visibleTasks = tasks;
  for (const task of visibleTasks) {
    const item = document.createElement('li');
    item.className = 'task';

    const title = document.createElement('span');

    title.className = 'task-title';
    title.textContent = task.title;


    item.append(title);
    taskList.append(item);
  }
  const completed = tasks.filter((task) => task.completed).length;
  taskCount.textContent = tasks.length + ' ' + (tasks.length === 1 ? 'tarefa' : 'tarefas') + ' · ' + completed + ' ' + (completed === 1 ? 'concluída' : 'concluídas');
  emptyState.hidden = visibleTasks.length > 0;
  emptyState.textContent = 'Nenhuma tarefa.';

}



form.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const editing = false;
    tasks = addTask(tasks, titleInput.value);
    render();
    form.reset(); titleInput.focus();
    showMessage(editing ? 'Tarefa atualizada.' : 'Tarefa adicionada.');
  } catch (error) {
    showMessage(error.message, true);
  }
});
render();
