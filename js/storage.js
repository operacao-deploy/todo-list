import { validateTitle } from './tasks.js';

export const STORAGE_KEY = 'todo-list.tasks.v1';

function validateStoredTasks(value) {
  if (!Array.isArray(value)) throw new Error('Lista inválida.');
  const ids = new Set();
  return value.map((task) => {
    if (!task || typeof task.id !== 'string' || !task.id.trim()
        || ids.has(task.id) || typeof task.completed !== 'boolean') {
      throw new Error('Tarefa salva inválida.');
    }
    ids.add(task.id);
    return { id: task.id, title: validateTitle(task.title), completed: task.completed };
  });
}

export function loadTasks(storage) {
  try {
    const value = (storage ?? globalThis.localStorage).getItem(STORAGE_KEY);
    return value === null ? [] : validateStoredTasks(JSON.parse(value));
  } catch {
    throw new Error('Não foi possível ler as tarefas salvas. Os dados não foram alterados. Verifique o armazenamento do navegador e recarregue a página.');
  }
}

export function saveTasks(tasks, storage) {
  try {
    (storage ?? globalThis.localStorage).setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    throw new Error('Não foi possível salvar as tarefas. Nenhuma alteração foi aplicada. Verifique o espaço e a permissão de armazenamento do navegador.');
  }
}
