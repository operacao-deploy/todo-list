import { addTask, editTask, toggleTask, deleteTask, searchTasks } from './tasks.js';
import { loadTasks, saveTasks } from './storage.js';

const form = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-title');
const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('#task-count');
const emptyState = document.querySelector('#empty-state');
const message = document.querySelector('#message');
const formHeading = document.querySelector('#form-heading');
const submitButton = document.querySelector('#submit-task');
const cancelButton = document.querySelector('#cancel-edit');
const searchInput = document.querySelector('#task-search');
const searchCount = document.querySelector('#search-count');
let tasks = [];
let editingId = null;

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('error', isError);
}

function render() {
  taskList.replaceChildren();
  const visibleTasks = searchTasks(tasks, searchInput.value);
  for (const task of visibleTasks) {
    const item = document.createElement('li');
    item.className = 'task';
    item.classList.toggle('completed', task.completed);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `task-${task.id}`;
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `${task.completed ? 'Reabrir' : 'Concluir'} tarefa: ${task.title}`);
    checkbox.addEventListener('change', () => {
      try {
        commitTasks(toggleTask(tasks, task.id));
        showMessage(task.completed ? 'Tarefa reaberta.' : 'Tarefa concluída.');
      } catch (error) {
        render();
        showMessage(error.message, true);
      }
      document.getElementById(checkbox.id)?.focus();
    });
    const title = document.createElement('label');
    title.htmlFor = checkbox.id;
    title.className = 'task-title';
    title.textContent = task.title;
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'secondary';
    editButton.textContent = 'Editar';
    editButton.setAttribute('aria-label', `Editar tarefa: ${task.title}`);
    editButton.addEventListener('click', () => {
      editingId = task.id;
      titleInput.value = task.title;
      formHeading.textContent = 'Editar tarefa';
      submitButton.textContent = 'Salvar';
      cancelButton.hidden = false;
      titleInput.focus();
      showMessage('');
    });
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'secondary danger';
    deleteButton.textContent = 'Excluir';
    deleteButton.setAttribute('aria-label', `Excluir tarefa: ${task.title}`);
    deleteButton.addEventListener('click', () => {
      try {
        commitTasks(deleteTask(tasks, task.id));
        if (editingId === task.id) resetForm();
        titleInput.focus();
        showMessage('Tarefa excluída.');
      } catch (error) {
        showMessage(error.message, true);
      }
    });
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    actions.append(editButton, deleteButton);
    item.append(checkbox, title, actions);
    taskList.append(item);
  }
  const completed = tasks.filter((task) => task.completed).length;
  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'} · ${completed} ${completed === 1 ? 'concluída' : 'concluídas'}`;
  emptyState.hidden = visibleTasks.length > 0;
  emptyState.textContent = searchInput.value.trim()
    ? 'Nenhum resultado.'
    : 'Nenhuma tarefa.';
  searchCount.textContent = searchInput.value.trim()
    ? `${visibleTasks.length} ${visibleTasks.length === 1 ? 'resultado' : 'resultados'}` : '';
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

searchInput.addEventListener('input', render);

function commitTasks(nextTasks) {
  // Só confirma a mudança na tela depois de salvar com sucesso.
  saveTasks(nextTasks);
  tasks = nextTasks;
  render();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const editing = editingId !== null;
    const nextTasks = editing
      ? editTask(tasks, editingId, titleInput.value)
      : addTask(tasks, titleInput.value);
    commitTasks(nextTasks);
    resetForm();
    showMessage(editing ? 'Tarefa atualizada.' : 'Tarefa adicionada.');
  } catch (error) {
    showMessage(error.message, true);
  }
});

try {
  tasks = loadTasks();
  render();
} catch (error) {
  titleInput.disabled = true;
  submitButton.disabled = true;
  searchInput.disabled = true;
  emptyState.textContent = 'A lista não pôde ser carregada.';
  taskCount.textContent = 'Armazenamento indisponível';
  showMessage(error.message, true);
}
