import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { materialIcons } from "../src/config/icons";

/** Recursively list .ts/.tsx files under src. */
function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

/**
 * The Material Symbols font is subset to the names in src/config/icons.ts. Any icon used in a
 * component or data file that is missing from that list would render as plain text, so fail early.
 */
test("every Material Symbols icon used in src is in the subset list", () => {
  const listed = new Set<string>(materialIcons);
  const used = new Set<string>();
  const patterns = [/<Icon name="([a-z_0-9]+)"/g, /\bicon: "([a-z_0-9]+)"/g, /\bicon="([a-z_0-9]+)"/g, /name=\{[^}]*?"([a-z_0-9]+)"[^}]*\}/g];
  for (const file of sourceFiles(join(process.cwd(), "src"))) {
    if (file.endsWith(join("config", "icons.ts"))) continue;
    const text = readFileSync(file, "utf8");
    for (const pattern of patterns) {
      for (const match of text.matchAll(pattern)) {
        // "whatsapp" is rendered with the WhatsAppIcon SVG, not the icon font.
        if (match[1] !== "whatsapp") used.add(match[1]);
      }
    }
  }
  // Conditional expressions can carry two literals; capture both.
  for (const file of sourceFiles(join(process.cwd(), "src"))) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/name=\{[^}]*\?\s*"([a-z_0-9]+)"\s*:\s*"([a-z_0-9]+)"\s*\}/g)) {
      used.add(match[1]);
      used.add(match[2]);
    }
  }
  const missing = [...used].filter((name) => !listed.has(name)).sort();
  expect(missing, "icons used but missing from src/config/icons.ts").toEqual([]);
  expect([...materialIcons]).toEqual([...materialIcons].sort());
});
