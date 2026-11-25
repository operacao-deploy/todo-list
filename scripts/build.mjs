import { copyFile, lstat, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(root, 'dist');
const required = ['index.html', 'css/style.css', 'js/app.js', 'js/tasks.js', 'js/storage.js'];
const scripts = (await readdir(path.join(root, 'js'))).filter((name) => name.endsWith('.js'));
const files = [...new Set([...required, ...scripts.map((name) => `js/${name}`)])];

// Este build verifica os arquivos e a sintaxe, sem compilar JavaScript.
for (const file of files) {
  const source = path.join(root, file);
  const info = await lstat(source);
  if (!info.isFile() || info.isSymbolicLink() || !(await readFile(source, 'utf8')).trim()) {
    throw new Error(`Arquivo obrigatório inválido: ${file}`);
  }
  if (file.endsWith('.js')) {
    const result = spawnSync(process.execPath, ['--check', source], { stdio: 'inherit' });
    if (result.status !== 0) throw new Error(`Sintaxe inválida: ${file}`);
  }
}

// Limpeza restrita à pasta gerada, nunca a um caminho recebido pelo usuário.
if (path.dirname(output) !== path.resolve(root)) throw new Error('Saída fora do projeto.');
const existing = await lstat(output).catch((error) => {
  if (error.code !== 'ENOENT') throw error;
});
if (existing?.isSymbolicLink()) throw new Error('A pasta dist não pode ser um link.');
await rm(output, { recursive: true, force: true });
for (const file of files) {
  const destination = path.join(output, file);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(path.join(root, file), destination);
}
// O manifest permite comparar o commit do pipeline com a versão publicada.
let commit = null;
let modified = null;
try {
  commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  modified = execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() !== '';
} catch {
  // Código obtido por ZIP pode não ter Git; não inventar uma revisão.
}
await writeFile(path.join(output, 'version.json'), `${JSON.stringify({ commit, modified }, null, 2)}\n`);
console.log(`Build aprovado: ${files.length} arquivos verificados e version.json gerado em dist/.`);
