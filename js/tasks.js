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
