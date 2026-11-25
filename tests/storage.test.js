import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTasks, saveTasks, STORAGE_KEY } from '../js/storage.js';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('inicia com lista vazia quando não há dados salvos', () => {
  assert.deepEqual(loadTasks(memoryStorage()), []);
});

test('salva e recupera descrições, identificadores e conclusão', () => {
  const storage = memoryStorage();
  const tasks = [{ id: '1', title: 'Revisar apresentação', completed: true }];
  saveTasks(tasks, storage);
  assert.deepEqual(loadTasks(storage), tasks);
  assert.notEqual(loadTasks(storage), tasks);
  saveTasks([], storage);
  assert.deepEqual(loadTasks(storage), []);
});

test('rejeita JSON corrompido e mantém o conteúdo original para recuperação', () => {
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEY, '{corrompido');
  assert.throws(() => loadTasks(storage), /Os dados não foram alterados/);
  assert.equal(storage.getItem(STORAGE_KEY), '{corrompido');
});
