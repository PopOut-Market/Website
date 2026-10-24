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
 * Only copy is checked: string literals, template literals and JSX text, read
 * with the TypeScript parser, so comments never count and text containing "//"
 * is never cut short. Whitespace inside a piece of copy is collapsed first, so a
 * phrase broken across source lines is still caught. A phrase split across two
 * separate pieces of copy (e.g. "identity <b>check</b>") is not.
 *
 * Add a phrase here whenever a new rule lands in CLAUDE.md, in every language
 * the site ships: en, zh-Hans, zh-Hant, ko, ja, vi, fr, es.
 *
 * Rule 1's one exception (2026-10-24) is checked here too: a feature the app does
 * not ship yet may get one dated sentence, and that sentence lives in
 * lib/upcoming.ts. So announcement phrases ("coming soon", "即将推出", "곧 출시"…)
 * fail anywhere else, lib/upcoming.ts may be imported only by the page bodies in
 * UPCOMING_IMPORTERS (never metadata, JSON-LD, the sitemap or a comparison page),
 * and an entry past its `reviewBy` date fails until someone re-checks it.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const ROOT = process.cwd();

/** Public, indexable copy only. Admin screens and API code are not shown to users. */
const SCAN = [
  "app/(site)",
  "app/download",
  "app/sitemap.ts",
  "app/robots.ts",
  "app/opengraph-image.tsx",
  "app/twitter-image.tsx",
  "app/global-error.tsx",
  "components",
  "lib",
];
const SKIP = [
  /^components\/admin/,
  /^lib\/supabase\/admin/,
  /^lib\/shop-review\.ts$/,
  /^lib\/influencers\.ts$/,
];

/** Pages whose legal duty is to describe identity checks on privacy requests, not the product. */
const LEGAL_PAGES = [
  /^components\/privacy-page-content\.tsx$/,
  /^components\/terms-page-content\.tsx$/,
];

/** The one home of sentences about unshipped features, and the page bodies allowed to render them. */
const UPCOMING_FILE = "lib/upcoming.ts";
const UPCOMING_IMPORTERS = [
  "components/home-page-content.tsx",
  "components/about-page-content.tsx",
];

const SCAM_WORDS =
  "scams?|scammers?|fraud|诈骗|骗局|詐騙|騙局|사기|詐欺|lừa đảo|arnaques?|escroqueries?|fraudes?|estafas?";
const STAT = "\\d[\\d,.]*\\s*(?:%|％|percent|per cent|퍼센트|倍|×|x\\b|times|fois|veces|lần)";

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
    pattern:
      /\bstudent verification\b|\bverified students?\b|学生认证|學生認證|학생 ?인증|学生認証|xác (minh|thực) sinh viên|sinh viên (đã )?xác (minh|thực)|vérification (des |d['’])?étudiants?|étudiants? vérifiés?|verificación de estudiantes|estudiantes verificados/i,
  },
  {
    id: "safety-zone",
    why: 'There is no "Safety Zone" concept in the app.',
    pattern:
      /\bsafety zones?\b|安全区|安全區|안전 ?구역|セーフティゾーン|安全ゾーン|vùng an toàn|zones? de sécurité|zonas? segura|zonas? de seguridad/i,
  },
  {
    id: "pre-announcement",
    why: "A feature the app does not ship is described only in lib/upcoming.ts (CLAUDE.md rule 1).",
    pattern:
      /\bcoming soon\b|\bon the way\b|\b(?:in|under) development\b|\bwe(?:['’]re| are) (?:building|testing)\b|\bbeing tested\b|\blaunch(?:ing|es) soon\b|\bstay tuned\b|即将推出|即将上线|敬请期待|正在开发|正在测试|正在准备中|开发中|筹备中|即將推出|即將上線|敬請期待|正在開發|正在測試|準備中|開發中|籌備中|곧 출시|출시 예정|오픈 예정|개발 중|테스트 중|준비하고 있어요|준비하고 있습니다|준비 중입니다|近日公開|近日リリース|リリース予定|開発中|まもなく登場|sắp ra mắt|đang phát triển|đang thử nghiệm|bientôt disponible|en cours de développement|arrive bientôt|próximamente|en desarrollo|en pruebas|llegará pronto|disponible pronto/i,
    allowIn: [/^lib\/upcoming\.ts$/],
  },
  {
    id: "scam-statistic",
    why: "Never a scam or fraud statistic.",
    pattern: new RegExp(
      `(?:${STAT})[^.!?。！？]{0,40}(?:${SCAM_WORDS})|(?:${SCAM_WORDS})[^.!?。！？]{0,40}(?:${STAT})`,
      "i",
    ),
  },
];

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  if (!statSync(dir).isDirectory()) {
    if (/\.(ts|tsx)$/.test(dir)) out.push(dir);
    return out;
  }
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(path);
  }
  return out;
}

/** Every piece of copy in a file — string literals, template literals, JSX text — with its line. */
export function extractCopy(fileName, source) {
  const kind = fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, kind);
  const pieces = [];
  const add = (text, node) => {
    const value = text.replace(/\s+/g, " ").trim();
    if (value)
      pieces.push({
        text: value,
        line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1,
      });
  };
  const visit = (node) => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isJsxText(node)
    ) {
      add(node.text, node);
    } else if (ts.isTemplateExpression(node)) {
      // Join the literal parts around a placeholder, so words on either side of an
      // interpolation never fuse into one phrase.
      add(
        [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join(" … "),
        node,
      );
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return pieces;
}

const UPCOMING_SPEC = /(?:^@\/lib|\/lib|^\.)\/upcoming$/;

/**
 * Sentence-ending marks in a copy string, ignoring any inside quotes ("Coming
 * soon!"). A straight single quote only counts as a quotation mark when no Latin
 * letter or digit touches it on the outside, so the apostrophes in "isn't" and
 * "we're" cannot pair up and hide a second sentence; Korean particles may follow
 * a closing quote ('집 구하기'는).
 */
function sentenceEnds(text) {
  const unquoted = text.replace(
    /“[^”]*”|「[^」]*」|(?<![A-Za-z0-9])'[^']*'(?![A-Za-z0-9])|"[^"]*"/g,
    "",
  );
  return (unquoted.match(/[.!?](?!\d)|[。！？]/g) ?? []).length;
}

/**
 * Outside the allowed page bodies: any import, re-export or dynamic import of
 * lib/upcoming. Inside lib/upcoming.ts: a copy string longer than one sentence,
 * or a `reviewBy: "YYYY-MM-DD"` earlier than `today`.
 */
function upcomingProblems(rel, source, today) {
  const kind = rel.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(rel, source, ts.ScriptTarget.Latest, true, kind);
  const lineOf = (node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
  const problems = [];
  if (rel !== UPCOMING_FILE && !UPCOMING_IMPORTERS.includes(rel)) {
    const visit = (node) => {
      const spec =
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier
          ? node.moduleSpecifier
          : ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword
            ? node.arguments[0]
            : null;
      if (spec && ts.isStringLiteralLike(spec) && UPCOMING_SPEC.test(spec.text)) {
        problems.push(
          `${rel}:${lineOf(node)} [upcoming-import] lib/upcoming.ts may only be rendered by ${UPCOMING_IMPORTERS.join(", ")} — never in metadata, JSON-LD, the sitemap or a comparison page.`,
        );
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  if (rel === UPCOMING_FILE) {
    const visit = (node) => {
      if (ts.isPropertyAssignment(node)) {
        const name = node.name.getText(sf);
        if (
          name === "reviewBy" &&
          ts.isStringLiteral(node.initializer) &&
          node.initializer.text < today
        ) {
          problems.push(
            `${rel}:${lineOf(node)} [upcoming-review] reviewBy ${node.initializer.text} has passed. Re-check the sentence against the app: rewrite it for the shipped feature, delete it, or set a new reviewBy.`,
          );
        }
        if (name === "copy" && ts.isObjectLiteralExpression(node.initializer)) {
          for (const prop of node.initializer.properties) {
            if (
              ts.isPropertyAssignment(prop) &&
              ts.isStringLiteralLike(prop.initializer) &&
              sentenceEnds(prop.initializer.text) > 1
            ) {
              problems.push(
                `${rel}:${lineOf(prop)} [upcoming-one-sentence] ${prop.name.getText(sf)} has ${sentenceEnds(prop.initializer.text)} sentences. The exception allows one dated sentence per feature (CLAUDE.md rule 1).`,
              );
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return problems;
}

export function findProblems(rel, source, today = new Date().toISOString().slice(0, 10)) {
  const problems = [];
  for (const { text, line } of extractCopy(rel, source)) {
    for (const rule of RULES) {
      if (rule.allowIn?.some((re) => re.test(rel))) continue;
      const match = text.match(rule.pattern);
      if (match) problems.push(`${rel}:${line} [${rule.id}] "${match[0]}" — ${rule.why}`);
    }
  }
  problems.push(...upcomingProblems(rel, source, today));
  return problems;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const problems = [];
  for (const base of SCAN) {
    for (const file of walk(join(ROOT, base))) {
      const rel = relative(ROOT, file);
      if (SKIP.some((re) => re.test(rel))) continue;
      problems.push(...findProblems(rel, readFileSync(file, "utf8")));
    }
  }
  if (problems.length) {
    console.error(`Banned product claims found (${problems.length}):\n${problems.join("\n")}`);
    process.exit(1);
  }
  console.log("check:claims — no banned claims in public copy.");
}
