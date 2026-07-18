/**
 * Postgres local para desenvolvimento fora do Replit (onde normalmente a BD
 * vem pré-provisionada). Usa embedded-postgres para não depender de uma
 * instalação de sistema. Dados persistem em .local/pgdata (já ignorado
 * pelo .gitignore, secção "# Replit").
 *
 * Uso: pnpm --filter @workspace/scripts run local-db
 * Mantém o processo vivo — corre em segundo plano enquanto se desenvolve.
 */
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import EmbeddedPostgres from "embedded-postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "..", ".local", "pgdata");
const port = 5433;
const user = "postgres";
const password = "postgres";
const dbName = "inatro_dev";

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user,
  password,
  port,
  persistent: true,
});

async function main() {
  const alreadyInitialised = existsSync(join(dataDir, "PG_VERSION"));
  if (!alreadyInitialised) {
    console.log(`A inicializar cluster Postgres em ${dataDir}...`);
    await pg.initialise();
  }

  await pg.start();
  console.log(`Postgres a correr em localhost:${port}`);

  try {
    await pg.createDatabase(dbName);
    console.log(`Base de dados "${dbName}" criada.`);
  } catch (err) {
    console.log(`Base de dados "${dbName}" já existe (ok).`);
  }

  const databaseUrl = `postgres://${user}:${password}@localhost:${port}/${dbName}`;
  console.log("\nDATABASE_URL=" + databaseUrl + "\n");

  const shutdown = async () => {
    console.log("A parar Postgres...");
    await pg.stop();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  // mantém o processo vivo
  await new Promise(() => {});
}

main().catch((err) => {
  console.error("Falha ao arrancar Postgres local:", err);
  process.exit(1);
});
