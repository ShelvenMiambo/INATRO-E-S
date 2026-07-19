# Deploy no Cloudflare (Workers + Assets)

Este projeto (`artifacts/rumo-carta`) corre no Cloudflare como um **Worker
com assets estáticos**: o Vite gera os ficheiros em `dist/public`, e
`worker/index.ts` serve `/api/*` (lendo a base de dados D1) e delega tudo o
resto para esses ficheiros estáticos via o binding `ASSETS`.

> **Porquê não Pages Functions:** o dashboard atual do Cloudflare unificou
> tudo sob "Create a Worker" — já não existe (ou não é visível) uma opção
> separada de "Create a Pages project". O token de CI gerado por este fluxo
> só tem permissões da API de Workers, não da API de Pages: tentar
> `wrangler pages deploy` dá sempre `Authentication error [code: 10000]`,
> mesmo sendo Super Admin da conta — o token em si não tem esse scope, e
> não há como alargá-lo manualmente (é gerido pela integração). Por isso
> `worker/index.ts` reimplementa a API como um Worker normal (que usa
> `wrangler deploy`, já com as permissões certas), reutilizando o mesmo
> `functions/_shared/schema.ts`/`db.ts`. Os ficheiros em `functions/api/**`
> continuam no repo (não fazem mal) mas não são o que responde em produção.

Testado localmente com `wrangler dev`: build de produção real, D1 local
seedada (208 perguntas, 732 opções, 8 categorias), todos os endpoints
(`/api/healthz`, `/api/categorias`, `/api/simulado/count`,
`/api/simulado/questoes`) e a homepage a responder corretamente.

## Configuração do projeto no dashboard (Create a Worker → Connect to Git)

- **Project name**: o que quiseres (o `name` em `wrangler.toml`, `inatro-e-s`,
  tem de ficar consistente com isto — minúsculas e traços só)
- **Path** (root directory do monorepo): `artifacts/rumo-carta`
- **Build command**: `pnpm install && pnpm run build`
- **Deploy command**: `npx wrangler deploy` (o valor por omissão)

## Passos que precisam da tua conta Cloudflare

Não os posso executar por ti (autenticação interativa via browser).

### 1. Autenticar (só se fores correr comandos localmente)

```sh
cd artifacts/rumo-carta
npx wrangler login
```

### 2. Criar a base de dados D1

```sh
npm run cf:d1:create
```

Copia o `database_id` devolvido para `wrangler.toml` (substitui
`PREENCHER_APOS_CF_D1_CREATE`) e faz commit dessa alteração — o build
automático do Cloudflare precisa dele no `wrangler.toml` do repositório.

### 3. Aplicar o schema e semear os dados na D1 remota

```sh
npm run cf:d1:migrate:remote
npm run cf:d1:seed:remote
```

### 4. Deploy

Com o Git ligado, cada push para `master` faz build+deploy automático.
Para fazer manualmente a partir daqui:

```sh
npm run cf:deploy
```

No fim, o Cloudflare devolve o URL público (algo como
`https://inatro-e-s.<subdomínio>.workers.dev`).

## Notas

- Este deployment é independente do Replit: o schema/API do Replit
  (`lib/db`, `artifacts/api-server`, Postgres) continuam a funcionar sem
  alterações — o Cloudflare usa um schema D1 próprio em `functions/_shared/`,
  partilhado pelo `worker/index.ts`.
- Autenticação, gamificação e histórico de tentativas ainda vivem só no
  browser (localStorage) — não há tabelas de utilizadores na D1 ainda.
- Para testar localmente: `npm run cf:dev` (faz build e arranca
  `wrangler dev`, que lê `wrangler.toml` — Worker + assets + D1 local).
