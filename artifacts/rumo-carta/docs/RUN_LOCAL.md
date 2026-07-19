# Correr o RumoCarta localmente

Este guia corre a versão que vai para o Cloudflare (Worker + D1) — a mais
fiel ao que está em produção. Tudo isto corre dentro de
`artifacts/rumo-carta`.

## 1. Pré-requisitos

- **Node.js 22+**
- **pnpm**: `npm install -g pnpm`

## 2. Instalar dependências

A partir da **raiz do monorepo** (`INATRO-E-S/`, não de dentro de
`artifacts/rumo-carta`):

```sh
pnpm install
```

Isto instala as dependências de todos os pacotes do workspace (frontend,
scripts, etc.) de uma vez.

## 3. Preparar a base de dados local (D1)

A partir daqui, todos os comandos correm dentro de `artifacts/rumo-carta`:

```sh
cd artifacts/rumo-carta
npm run cf:d1:migrate:local   # cria as tabelas (schema.sql)
npm run cf:d1:seed:local      # semeia as 208 perguntas + 8 categorias
```

Só precisas de repetir isto se apagares a pasta `.wrangler/` (onde vive
a base de dados local) ou se o `schema.sql` mudar.

## 4. Build do frontend

```sh
npm run build
```

Gera `dist/public/` (HTML/CSS/JS). Sempre que alterares algo em `src/`,
tens de repetir este passo antes de testar com `wrangler dev` (não há
hot-reload neste modo — ver alternativa mais abaixo).

## 5. Arrancar o servidor

```sh
npm run cf:dev
```

Isto arranca o `wrangler dev`, que corre o Worker (`worker/index.ts`) tal
como vai correr no Cloudflare — API (`/api/*`) + base de dados D1 local +
ficheiros estáticos do build. Por omissão fica disponível em
`http://localhost:8787` (o wrangler imprime o URL exato no terminal).

## Alternativa: só o frontend, com hot-reload

Se só estiveres a mexer em componentes React/UI e não precisares da API
real, é mais rápido correr só o Vite:

```sh
PORT=5173 BASE_PATH=/ npm run dev
```

Isto dá hot-reload instantâneo, mas as chamadas a `/api/*` vão falhar
(não há nenhum servidor de API a correr). Para testar fluxos completos
(login, simulados, dashboard), usa sempre o passo 5 (`npm run cf:dev`).

## Reset da base de dados local

Se quiseres começar do zero (ex: depois de mudares o `schema.sql`):

```sh
rm -rf .wrangler/state
npm run cf:d1:migrate:local
npm run cf:d1:seed:local
```
