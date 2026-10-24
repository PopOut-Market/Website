// Cases for scripts/check-claims.mjs. Run with `npm run check:claims` (or `node --test scripts/`).
// Several come from the 2026-10-24 Codex review: phrases the first version missed or mis-read.
import assert from "node:assert/strict";
import { test } from "node:test";
import { findProblems } from "./check-claims.mjs";

const flagged = (src, file = "components/case.tsx") => findProblems(file, src).length > 0;

test("catches banned claims in every language that ships", () => {
  for (const src of [
    'const a = "verificación de estudiantes";',
    'const a = "vérification des étudiants";',
    'const a = "xác minh sinh viên";',
    'const a = "quedad en una zona segura";',
    'const a = "une zone de sécurité";',
    'const a = "vùng an toàn";',
    'const a = "현재 멜버른에서 운영 중이며, 호주 내 더 많은 도시로 확대될 예정입니다.";',
    'const a = "Ya en Melbourne y pronto en más ciudades de Australia.";',
  ]) {
    assert.ok(flagged(src), src);
  }
});

test("catches scam statistics", () => {
  assert.ok(flagged('const a = "99% fewer scams";'));
  assert.ok(flagged('const a = "诈骗减少 90%";'));
  assert.ok(flagged('const a = "3× fewer scams";'));
  assert.ok(flagged('const a = "Scams reduced 3×";'));
});

test("reads copy, not comments", () => {
  assert.ok(flagged('const a = "Buy // auto-reply";'));
  assert.ok(flagged('const a = "Buy /* auto-reply */";'));
  assert.ok(!flagged('const copy = "fine"// auto-reply'));
  assert.ok(!flagged("// auto-reply is banned"));
  assert.ok(!flagged("onClick={() => void checkDuplicates()}"));
  assert.ok(!flagged('const u = "https://example.com/id-check-tips";'));
});

test("joins JSX text across lines but not across interpolations", () => {
  assert.ok(flagged("export const X = () => <p>identity\n   check</p>;"));
  assert.ok(!flagged("const t = `more ${x} Australian cities`;"));
  assert.ok(flagged("const t = `soon in more cities ${x}`;"));
});

test("legal pages may describe identity checks on privacy requests", () => {
  assert.ok(!flagged('const a = "we may need to verify your identity";', "components/privacy-page-content.tsx"));
});
