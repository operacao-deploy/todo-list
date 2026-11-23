import test from 'node:test';
import assert from 'node:assert/strict';
import { addTask, MAX_TITLE_LENGTH } from '../js/tasks.js';

test('cadastra tarefa pendente, remove espaços externos e preserva a lista anterior', () => {
  const previous = [{ id: '1', title: 'Estudar', completed: true }];
  const result = addTask(previous, '  Preparar apresentação  ', '2');
  assert.deepEqual(result, [previous[0], { id: '2', title: 'Preparar apresentação', completed: false }]);
  assert.equal(previous.length, 1);
});

test('impede cadastro vazio ou formado apenas por espaços', () => {
  for (const title of ['', '   ', '\t\n']) {
    assert.throws(() => addTask([], title, '1'), /Descreva a tarefa/);
  }
});

test('aceita o limite da descrição e rejeita texto acima dele', () => {
  assert.equal(addTask([], 'a'.repeat(MAX_TITLE_LENGTH), '1')[0].title.length, MAX_TITLE_LENGTH);
  assert.throws(() => addTask([], 'a'.repeat(MAX_TITLE_LENGTH + 1), '1'), /no máximo/);
});
