#!/usr/bin/env node
/**
 * Fails when public copy, in ANY of the eight languages, says something the
 * product rules in CLAUDE.md forbid.
 *
 * Why a script: the 2026-09-06 claim-correction pass removed "more Australian
 * cities coming soon" from the English pages by hand and left it in the Korean
 * and Spanish ones, where it stayed live in a meta description for weeks — and
 * the Korean pages are the ones AI Mode cites most for Korean questions. A rule
 * that has to be re-applied by hand in eight languages will be missed again.
 *
 *   npm run check:claims
 *
 * Comments are stripped before matching, so code may still explain what is
 * banned. Add a phrase here whenever a new rule lands in CLAUDE.md, in every
 * language the site ships.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

/** Public, indexable copy only. Admin screens and API code are not shown to users. */
const SCAN = ["app/(site)", "app/download", "components", "lib"];
const SKIP = [/^components\/admin/, /^lib\/supabase\/admin/, /^lib\/shop-review\.ts$/, /^lib\/influencers\.ts$/];

/** Pages whose legal duty is to describe identity checks on privacy requests, not the product. */
const LEGAL_PAGES = [/^components\/privacy-page-content\.tsx$/, /^components\/terms-page-content\.tsx$/];

const RULES = [
  {
    id: "expansion",
    why: "An unverifiable promise to expand beyond Melbourne (removed 2026-09-06).",
    pattern:
      /\bmore (Australian )?cities\b|\bother Australian cities\b|더 많은 도시|확대될 예정|más ciudades|otras ciudades de Australia|plus de villes|d'autres villes d'Australie|更多城市|其他城市|他の都市|thành phố khác/i,
  },
  {
    id: "identity",
    why: 'Verification is only "an Australian mobile number and a one-time location check".',
    pattern:
      /\bidentity checks?\b|\bID checks?\b|\bbackground checks?\b|\bage checks?\b|\bverif(y|ies|ied) (their|your|users'?) identit(y|ies)\b|\bidentity verification\b|身份验证|身份核验|身分驗證|身份驗證|实名认证|實名認證|신원 확인|신분 확인|本人確認|xác minh danh tính|vérification d['’]identité|verificación de identidad/i,
    allowIn: LEGAL_PAGES,
  },
  {
    id: "auto-reply",
    why: "The auto-replier was parked on 2026-06-19 and is hidden from the app.",
    pattern:
      /\bauto-?repl(y|ies|ier)\b|自动回复|自動回覆|자동 ?응답|自動返信|trả lời tự động|réponse automatique|respuesta automática/i,
  },
  {
    id: "student-verification",
    why: "There is no student verification in the app.",
    pattern: /\bstudent verification\b|\bverified students?\b|学生认证|學生認證|학생 인증|学生認証/i,
  },
  {
    id: "safety-zone",
    why: 'There is no "Safety Zone" concept in the app.',
    pattern: /\bsafety zones?\b|安全区|安全區|안전 구역|セーフティゾーン/i,
  },
];

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(path);
  }
  return out;
}

/** Blank out comments but keep line numbers, so code can still explain what is banned. */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`\\])\/\/.*$/gm, (_, lead) => lead);
}

const problems = [];
for (const base of SCAN) {
  for (const file of walk(join(ROOT, base))) {
    const rel = relative(ROOT, file);
    if (SKIP.some((re) => re.test(rel))) continue;
    const lines = stripComments(readFileSync(file, "utf8")).split("\n");
    lines.forEach((line, i) => {
      for (const rule of RULES) {
        if (rule.allowIn?.some((re) => re.test(rel))) continue;
        const match = line.match(rule.pattern);
        if (match) problems.push(`${rel}:${i + 1} [${rule.id}] "${match[0]}" — ${rule.why}`);
      }
    });
  }
}

if (problems.length) {
  console.error(`Banned product claims found (${problems.length}):\n${problems.join("\n")}`);
  process.exit(1);
}
console.log("check:claims — no banned claims in public copy.");
