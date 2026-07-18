# Deploy no Cloudflare Pages

Este projeto (`artifacts/rumo-carta`) está pronto para correr inteiramente no
Cloudflare: frontend Vite servido pelo Cloudflare Pages, API em Pages
Functions (`functions/api/**`), base de dados em Cloudflare D1.

Já testado localmente com `wrangler pages dev` — 208 perguntas, 8
categorias, todos os endpoints (`/api/healthz`, `/api/categorias`,
`/api/simulado/count`, `/api/simulado/questoes`) a responder corretamente.

Os passos abaixo precisam da tua conta Cloudflare — não os posso executar
por ti (autenticação interativa via browser).

## 1. Autenticar

```sh
cd artifacts/rumo-carta
npx wrangler login
```

Abre o browser e pede para autorizares a CLI na tua conta Cloudflare.

## 2. Criar a base de dados D1

```sh
npm run cf:d1:create
```

Isto imprime um bloco com `database_id = "..."`. Copia esse ID para
`wrangler.toml`, substituindo `PREENCHER_APOS_CF_D1_CREATE`.

## 3. Aplicar o schema e semear os dados na D1 remota

```sh
npm run cf:d1:migrate:remote
npm run cf:d1:seed:remote
```

## 4. Build e deploy

```sh
npm run cf:deploy
```

Isto corre `vite build` e depois `wrangler pages deploy dist/public`. Na
primeira vez, o wrangler pergunta o nome do projeto Pages (sugestão:
`rumo-carta`) e cria-o automaticamente.

No fim, o wrangler devolve o URL público (`https://rumo-carta.pages.dev` ou
semelhante).

## 5. (Opcional) Deploy automático a partir do GitHub

Em vez do passo 4, podes ligar o repositório GitHub
(`ShelvenMiambo/INATRO-E-S`) diretamente no dashboard do Cloudflare Pages:

- **Root directory**: `artifacts/rumo-carta`
- **Build command**: `npm install -g pnpm && pnpm install --frozen-lockfile && pnpm run build`
- **Build output directory**: `dist/public`
- Em **Settings → Functions → D1 database bindings**, adiciona o binding
  `DB` apontando para a base de dados `rumocarta-db` criada no passo 2.

Assim, cada push para `master` faz deploy automático.

## Notas

- Este deployment é independente do Replit: o schema/API do Replit
  (`lib/db`, `artifacts/api-server`, Postgres) continuam a funcionar sem
  alterações — o Cloudflare usa um schema D1 próprio em `functions/_shared/`.
- Autenticação, gamificação e histórico de tentativas ainda vivem só no
  browser (localStorage) — não há tabelas de utilizadores na D1 ainda.
  Se quiseres essa funcionalidade também no Cloudflare, é um passo seguinte.
