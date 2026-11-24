import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const directory = process.argv[2] ?? '.';
if (!['.', 'dist'].includes(directory)) throw new Error('Use a raiz do projeto ou dist.');
const root = path.resolve(projectRoot, directory);
const port = Number(process.env.PORT ?? 4173);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' };

const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Endereço inválido.');
    return;
  }
  if (pathname === '/') pathname = '/index.html';
  const allowed = ['/index.html', '/version.json'].includes(pathname)
    || pathname.startsWith('/css/') || pathname.startsWith('/js/');
  const target = path.resolve(root, `.${pathname}`);
  if (!allowed || !target.startsWith(root + path.sep) || pathname.split('/').some((part) => part.startsWith('.'))) {
    response.writeHead(404).end('Arquivo não encontrado.');
    return;
  }
  try {
    if (!(await stat(target)).isFile()) throw new Error('Não é arquivo.');
    const body = await readFile(target);
    response.writeHead(200, {
      'Content-Type': `${types[path.extname(target)] ?? 'application/octet-stream'}; charset=utf-8`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404).end('Arquivo não encontrado.');
  }
});
server.on('error', (error) => {
  console.error(`Não foi possível iniciar o servidor: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Aplicação: http://127.0.0.1:${port} (${directory})`);
  console.log('Pressione Ctrl+C para encerrar.');
});
