# Lista de tarefas

Aplicação para organizar tarefas e acompanhar pendências e conclusões.
Projeto acadêmico de Gerência de Configuração e Manutenção de Software.
Tecnologias: HTML, CSS e JavaScript; Node.js para ferramentas; GitHub Actions e Pages.

- **Integrantes:** Jose Wynder Alves Hernandes; Joao Lucas Silva de Souza; Joao Vitor Oliveira Abreu; Luan Henrique de Almeida dos Santos; Vinicius Ortiz Sian; Gabriel Cecilio Menezes
- **Repositório:** https://github.com/operacao-deploy/todo-list.git
- **Aplicação publicada:** a preencher após o primeiro deploy.

## Executar

Use Node.js 24.x com npm, na pasta do repositório:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm start
```

Abra http://127.0.0.1:4173 e encerre o servidor com Ctrl+C. Use esse endereço em
vez de abrir o HTML diretamente, pois a aplicação usa módulos JavaScript.
O Node é usado apenas nas ferramentas locais e no CI; não há bibliotecas npm
externas, backend ou chamadas a APIs na aplicação.

## Testes e build

```sh
npm test
npm run build
npm run check
```

São **dez testes** com o executor nativo `node --test`: cadastro, entrada vazia,
limite de descrição, edição, conclusão/reabertura, exclusão, busca,
armazenamento vazio, gravação/leitura e dados corrompidos.

O build verifica arquivos e sintaxe e copia HTML, CSS e JavaScript para `dist/`.
Não há compilação. `version.json` registra o commit e se havia alterações locais
(`modified`); sem metadados Git, os valores podem ser `null`. A pasta `dist/`
é gerada novamente a cada build e não é versionada.

`npm run check` executa testes e build. Para abrir o resultado do build, encerre
o servidor anterior e execute `npm run preview`, usando o mesmo endereço local.

## Organização

- `index.html`: página da aplicação.
- `css/`: estilos básicos.
- `js/`: regras das tarefas, armazenamento e interação com a tela.
- `tests/`: testes automatizados.
- `scripts/`: servidor local e preparação do build.
- `.github/workflows/ci-cd.yml`: pipeline do GitHub Actions.

## Pipeline e publicação

Push, pull request ou execução manual iniciam dois jobs independentes: testes
e build. O build gera o artefato `site-<SHA>`. Após ambos passarem, o job de
publicação usa esse mesmo artefato, prepara a entrega e publica no GitHub Pages.
A publicação só ocorre na branch padrão do repositório, fora de pull requests.
Uma falha em qualquer verificação impede esse job. Um commit apenas local
não inicia o GitHub Actions.

Para publicar:

1. Envie o projeto ao GitHub e confira a branch padrão (`master` ou `main`).
2. Em **Settings → Pages → Source**, selecione **GitHub Actions**.
3. Confirme que as actions oficiais do workflow são permitidas e que o ambiente
   `github-pages` permite a branch padrão. O workflow já declara as permissões
   `pages: write` e `id-token: write`; não precisa de token pessoal.
4. Faça um push na branch padrão ou use **Actions → CI e entrega → Run workflow**.
5. Após o deploy, abra a URL fornecida e confira o `version.json` no mesmo
   diretório do site: o commit deve corresponder à execução e `modified` ser
   `false`. Preencha o link da aplicação acima.

As configurações do Pages dependem do repositório e das políticas da organização.
A execução remota e a publicação ainda não foram verificadas nesta referência.

## Limitações

- Descrição obrigatória de até 120 caracteres; busca ignora maiúsculas e acentos.
- Os dados ficam na origem atual do navegador, na chave `todo-list.tasks.v1`.
  Não há sincronização, backup ou atualização simultânea entre abas.
- Limpar os dados do site remove a lista. Exclusões não têm opção de desfazer.
- Falhas no armazenamento são informadas sem confirmar mudanças não salvas;
  dados inválidos na inicialização bloqueiam alterações para preservá-los.
- Use um navegador moderno com JavaScript, localStorage e crypto.randomUUID.
  Não há modo offline instalado.
