const { spawn, execSync } = require("node:child_process");

const startWebServ = spawn("npm run dev:exit", {
  shell: "zsh",
  stdio: "inherit",
});

startWebServ.on("close", (code, signal) => {
  if (signal) {
    process.exit(0);
  } else if (code !== 0) {
    console.error(`\n O processo falhou com o codigo: ${code}`);
    process.exit(code);
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  console.log("Voce pressionou Ctrl + C!");

  startWebServ.kill("SIGINT");

  console.log("Rodando o script de limpeza (postdev)...");

  try {
    execSync("npm run postdev", {
      stdio: "inherit",
      shell: "zsh",
    });

    console.log("Limpeza concluida. Saindo...");
  } catch (error) {
    console.error("\n Erro durante a limpeza.");
  }
  process.exit(0);
});
