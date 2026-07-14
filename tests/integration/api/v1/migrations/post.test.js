import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

beforeAll(cleanDatabase); //Função beforeAll serve para fazer algo antes de tudo, nesse caso, limpar o DB.

async function cleanDatabase() {
  //Função para limpar o DB e o teste não ficar intermitente
  await database.query("drop schema public cascade; create schema public;");
}

// Realizamos 2 request no endpoint para cobrir o caso onde a a migração de fato é executada...
// E no outro é onde a migração ja foi executada no primeiro request, logo no segundo não tem nenhuma migração pendente.
test("POST to /api/v1/migrations should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  const responseBody = await response1.json();

  expect(Array.isArray(responseBody)).toBe(true);

  expect(responseBody.length).toBeGreaterThan(0);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const responseBody2 = await response2.json();

  expect(Array.isArray(responseBody2)).toBe(true);

  expect(responseBody2.length).toBe(0);
});
