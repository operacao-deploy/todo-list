import { addTask, editTask } from './tasks.js';

const form = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-title');
const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('#task-count');
const emptyState = document.querySelector('#empty-state');
const message = document.querySelector('#message');
const formHeading = document.querySelector('#form-heading');
const submitButton = document.querySelector('#submit-task');
const cancelButton = document.querySelector('#cancel-edit');

let tasks = [];
let editingId = null;

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
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'secondary';
    editButton.textContent = 'Editar';
    editButton.setAttribute('aria-label', 'Editar tarefa: ' + task.title);
    editButton.addEventListener('click', () => {
      editingId = task.id;
      titleInput.value = task.title;
      formHeading.textContent = 'Editar tarefa';
      submitButton.textContent = 'Salvar';
      cancelButton.hidden = false;
      titleInput.focus();
      showMessage('');
    });
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    actions.append(editButton);

    item.append(title, actions);
    taskList.append(item);
  }
  const completed = tasks.filter((task) => task.completed).length;
  taskCount.textContent = tasks.length + ' ' + (tasks.length === 1 ? 'tarefa' : 'tarefas') + ' · ' + completed + ' ' + (completed === 1 ? 'concluída' : 'concluídas');
  emptyState.hidden = visibleTasks.length > 0;
  emptyState.textContent = 'Nenhuma tarefa.';

}

function resetForm() {
  editingId = null;
  form.reset();
  formHeading.textContent = 'Adicionar tarefa';
  submitButton.textContent = 'Adicionar';
  cancelButton.hidden = true;
  titleInput.focus();
}
cancelButton.addEventListener('click', () => {
  resetForm();
  showMessage('Edição cancelada.');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const editing = editingId !== null;
    tasks = editing ? editTask(tasks, editingId, titleInput.value) : addTask(tasks, titleInput.value);
    render();
    resetForm();
    showMessage(editing ? 'Tarefa atualizada.' : 'Tarefa adicionada.');
  } catch (error) {
    showMessage(error.message, true);
  }
});
render();
