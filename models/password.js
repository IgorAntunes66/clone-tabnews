import bcryptjs from "bcryptjs";
import { createHash } from "node:crypto";
import { ValidationError } from "infra/errors";

async function hash(password) {
  const pepperedPassword = getPepper(password);
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(pepperedPassword, rounds);
}

async function compare(providedPassword, storedPassword) {
  const pepperedProvidedPassword = getPepper(providedPassword);
  return await bcryptjs.compare(pepperedProvidedPassword, storedPassword);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

function getPepper(password) {
  if (password === undefined) {
    throw new ValidationError({
      message: "Não foi informado a senha do usuario.",
      action: "Informe uma senha para realizar esta operação.",
    });
  }

  const secretPepper = process.env.HASHPEPPER || "";
  const passwordWithPepper = password + secretPepper;

  const hash = createHash("sha256");

  hash.update(passwordWithPepper);

  return hash.digest("hex");
}

const password = {
  hash,
  compare,
  getPepper,
};

export default password;
