#!/usr/bin/env node
/**
 * Fails if a sentence from lib/upcoming.ts reached a page's <title>, a <meta>
 * content (description, Open Graph, Twitter), an <h1>, or JSON-LD.
 *
 * Why: CLAUDE.md rule 1's exception lets a feature the app does not ship yet
 * get one dated sentence in a page body, never in those places, because answer
 * engines quote titles, descriptions, headings and structured data verbatim.
 * check:claims guards who may import lib/upcoming.ts; it cannot see what an
 * allowed page body does with it (the /about body also builds JSON-LD). This
 * reads what the build actually emitted.
 *
 * Runs after `npm run build` (the `postbuild` script). `--dir <path>` points it
 * at another folder of HTML, for testing.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const dirArg = process.argv.indexOf("--dir");
const OUT = dirArg > -1 ? process.argv[dirArg + 1] : join(ROOT, ".next/server/app");
const SOURCE = join(ROOT, "lib/upcoming.ts");

/** The longest stretch of each copy string between placeholders identifies it. */
function needles() {
  const source = readFileSync(SOURCE, "utf8");
  const sf = ts.createSourceFile(SOURCE, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const out = [];
  const visit = (node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(sf) === "copy" &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      for (const prop of node.initializer.properties) {
        if (ts.isPropertyAssignment(prop) && ts.isStringLiteralLike(prop.initializer)) {
          const [longest] = prop.initializer.text
            .split(/\{[A-Za-z]+\}/)
            .map((part) => part.trim())
            .sort((a, b) => b.length - a.length);
          if (longest && longest.length >= 12) out.push(longest);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

function htmlFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) htmlFiles(path, out);
    else if (name.endsWith(".html")) out.push(path);
  }
  return out;
}

const ENTITIES = { quot: '"', amp: "&", lt: "<", gt: ">", apos: "'", nbsp: " " };
function unescapeHtml(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return String.fromCodePoint(n);
    }
    return ENTITIES[code.toLowerCase()] ?? whole;
  });
}
const textOf = (html) => unescapeHtml(html.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, ""));

function jsonStrings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => jsonStrings(v, out));
  else if (value && typeof value === "object")
    Object.values(value).forEach((v) => jsonStrings(v, out));
  return out;
}

/** Every piece of text in a page that answer engines quote as-is, labelled by where it sits. */
function quotedPlaces(html) {
  const places = [];
  for (const m of html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi))
    places.push(["title", textOf(m[1])]);
  for (const m of html.matchAll(/<meta\b[^>]*\bcontent="([^"]*)"/gi))
    places.push(["meta", unescapeHtml(m[1])]);
  for (const m of html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)) places.push(["h1", textOf(m[1])]);
  for (const m of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      for (const s of jsonStrings(JSON.parse(m[1]))) places.push(["json-ld", s]);
    } catch {
      places.push(["json-ld", m[1]]);
    }
  }
  return places;
}

if (!existsSync(OUT)) {
  console.error(`check-upcoming-output: ${OUT} does not exist. Run npm run build first.`);
  process.exit(1);
}

const targets = needles();
const files = htmlFiles(OUT);
const problems = [];
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const [where, text] of quotedPlaces(html)) {
    for (const needle of targets) {
      if (text.includes(needle)) {
        problems.push(
          `${relative(ROOT, file)}: <${where}> carries an upcoming sentence: "${needle.slice(0, 60)}…"`,
        );
      }
    }
  }
}

if (problems.length) {
  console.error(
    `Upcoming-feature sentences found where CLAUDE.md rule 1 forbids them (${problems.length}):\n${problems.join("\n")}`,
  );
  process.exit(1);
}
console.log(
  `check-upcoming-output — ${files.length} pages, ${targets.length} sentences; none in a title, meta, H1 or JSON-LD.`,
);
