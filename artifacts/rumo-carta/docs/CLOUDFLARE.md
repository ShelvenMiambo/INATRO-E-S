# Deploy no Cloudflare (Workers + Assets)

Este projeto (`artifacts/rumo-carta`) está pronto para correr inteiramente no
Cloudflare como um **Worker com assets estáticos**: o Vite gera os ficheiros
em `dist/public`, e `worker/index.ts` serve `/api/*` (lendo a base de dados
D1) e delega tudo o resto para esses ficheiros estáticos via o binding
`ASSETS`.

> Isto substitui a tentativa inicial com Cloudflare Pages Functions
> (`functions/api/**`) — esses ficheiros continuam no repositório (e
> `worker/index.ts` reutiliza o mesmo `functions/_shared/schema.ts`/`db.ts`),
> mas quem responde de facto em produção é `worker/index.ts`, porque o
> projeto Cloudflare foi criado como "Workers" (não "Pages") e o deploy
> corre com `wrangler deploy`, não `wrangler pages deploy`.

Testado localmente com `wrangler dev`: build de produção real, D1 local
seedada (208 perguntas, 732 opções, 8 categorias), todos os endpoints
(`/api/healthz`, `/api/categorias`, `/api/simulado/count`,
`/api/simulado/questoes`) e a homepage a responder corretamente.

## Configuração do projeto Cloudflare (dashboard)

No projeto "inatroes" em Workers & Pages → Settings → Build:

- **Root directory**: `artifacts/rumo-carta`
- **Build command**: `pnpm install && pnpm run build`
- **Deploy command**: `npx wrangler deploy` (o valor por omissão — não
  precisa de "pages deploy")

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

Isto imprime um bloco com `database_id = "..."`. Copia esse ID para
`wrangler.toml`, substituindo `PREENCHER_APOS_CF_D1_CREATE`, e faz commit
dessa alteração (o build automático do Cloudflare precisa dele no
`wrangler.toml` do repositório).

### 3. Aplicar o schema e semear os dados na D1 remota

```sh
npm run cf:d1:migrate:remote
npm run cf:d1:seed:remote
```

### 4. Deploy

Com o Git ligado, basta fazer push para `master` — o Cloudflare builda e
faz deploy automaticamente. Para fazer manualmente a partir daqui:

```sh
npm run cf:deploy
```

No fim, o wrangler devolve o URL público (algo como
`https://inatroes.<subdomínio>.workers.dev`).

## Notas

- Este deployment é independente do Replit: o schema/API do Replit
  (`lib/db`, `artifacts/api-server`, Postgres) continuam a funcionar sem
  alterações — o Cloudflare usa um schema D1 próprio em `functions/_shared/`,
  partilhado pelo `worker/index.ts`.
- Autenticação, gamificação e histórico de tentativas ainda vivem só no
  browser (localStorage) — não há tabelas de utilizadores na D1 ainda.
  Se quiseres essa funcionalidade também no Cloudflare, é um passo seguinte.
- Para testar localmente: `npm run build && npm run cf:dev` (arranca
  `wrangler dev`, que lê `wrangler.toml` — Worker + assets + D1 local).
