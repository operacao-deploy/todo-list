export const MAX_TITLE_LENGTH = 120;

export function validateTitle(value) {
  if (typeof value !== 'string') throw new Error('Informe uma descrição válida.');
  const title = value.trim();
  if (!title) throw new Error('Descreva a tarefa antes de continuar.');
  if (title.length > MAX_TITLE_LENGTH) {
    throw new Error(`Use no máximo ${MAX_TITLE_LENGTH} caracteres.`);
  }
  return title;
}

export function addTask(tasks, title, id = crypto.randomUUID()) {
  const description = validateTitle(title);
  if (typeof id !== 'string' || !id.trim() || tasks.some((task) => task.id === id)) {
    throw new Error('Não foi possível identificar a nova tarefa.');
  }
  return [...tasks, { id, title: description, completed: false }];
}

function requireTask(tasks, id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) throw new Error('Tarefa não encontrada.');
  return task;
}

export function editTask(tasks, id, title) {
  requireTask(tasks, id);
  const description = validateTitle(title);
  return tasks.map((task) => task.id === id ? { ...task, title: description } : task);
}
