# Deploy no Cloudflare Pages

Este projeto (`artifacts/rumo-carta`) corre no **Cloudflare Pages**: frontend
Vite servido como site estático, API em Pages Functions (`functions/api/**`),
base de dados em Cloudflare D1.

> **Importante**: tem de ser um projeto do tipo **Pages**, não **Workers**.
> Um projeto "Workers" (mesmo ligado ao Git) usa `wrangler deploy`, que não
> processa a pasta `functions/` nem tem permissões da API de Pages — foi
> o que aconteceu da primeira vez (`Authentication error [code: 10000]`
> e "Missing entry-point to Worker script"). Se já existir um projeto
> "Workers" ligado a este repositório (ex: chamado "inatroes"), desliga-o
> do Git ou ignora-o — cria antes um projeto **Pages** novo, de raiz.

Testado localmente com `wrangler pages dev`: build de produção real, D1
local seedada (208 perguntas, 732 opções, 8 categorias), todos os endpoints
(`/api/healthz`, `/api/categorias`, `/api/simulado/count`,
`/api/simulado/questoes`) e a homepage a responder corretamente.

## Criar o projeto Pages

No dashboard: **Workers & Pages → Create → Pages → Connect to Git** →
seleciona `ShelvenMiambo/INATRO-E-S`.

Configuração de build:

- **Root directory**: `artifacts/rumo-carta`
- **Build command**: `pnpm install && pnpm run build`
- **Build output directory**: `dist/public`

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
`PREENCHER_APOS_CF_D1_CREATE`) e faz commit dessa alteração.

### 3. Aplicar o schema e semear os dados na D1 remota

```sh
npm run cf:d1:migrate:remote
npm run cf:d1:seed:remote
```

### 4. Ligar o binding D1 ao projeto Pages

Em **Settings → Functions → D1 database bindings**, adiciona:
- Variable name: `DB`
- D1 database: `rumocarta-db`

### 5. Deploy

Com o Git ligado, cada push para `master` faz build+deploy automático.
Para fazer manualmente a partir daqui:

```sh
npm run cf:deploy
```

No fim, o Cloudflare devolve o URL público (algo como
`https://rumo-carta.pages.dev`).

## Notas

- Este deployment é independente do Replit: o schema/API do Replit
  (`lib/db`, `artifacts/api-server`, Postgres) continuam a funcionar sem
  alterações — o Cloudflare usa um schema D1 próprio em `functions/_shared/`.
- Autenticação, gamificação e histórico de tentativas ainda vivem só no
  browser (localStorage) — não há tabelas de utilizadores na D1 ainda.
- Para testar localmente: `npm run cf:dev` (arranca `wrangler pages dev`,
  que lê `wrangler.toml` — Pages Functions + D1 local).
