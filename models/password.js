import bcryptjs from "bcryptjs";
import { createHash } from "node:crypto";

async function hash(pepperedPassword) {
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(pepperedPassword, rounds);
}

async function compare(providedPassword, storedPassword) {
  return await bcryptjs.compare(providedPassword, storedPassword);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function getPepper(password) {
  const hash = createHash("sha-256");

  hash.update(password);

  const digest = hash.digest("hex");
  return digest;
}

const password = {
  hash,
  compare,
  getPepper,
};

export default password;
