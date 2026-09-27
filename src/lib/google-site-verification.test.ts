import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// O Google Search Console confirma a posse de irisdownloader.com.br por estes
// arquivos. Apagar um deles derruba a verificação, e a verificação OAuth do app
// reprova no requisito "página inicial registrada para você" (aconteceu em
// 16/09/2026). Estes testes impedem que uma limpeza de public/ os remova.
const verificationFiles = [
  "google331fd428353957bb.html",
  "googlebd7d87258ee06b4f.html",
];

describe("arquivos de verificação do Google Search Console", () => {
  for (const file of verificationFiles) {
    it(`${file} continua em public/ com o conteúdo esperado`, () => {
      const path = join(process.cwd(), "public", file);
      expect(existsSync(path)).toBe(true);
      expect(readFileSync(path, "utf8").trim()).toBe(`google-site-verification: ${file}`);
    });
  }
});
