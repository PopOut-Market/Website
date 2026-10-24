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
  assert.ok(
    !flagged(
      'const a = "we may need to verify your identity";',
      "components/privacy-page-content.tsx",
    ),
  );
});

test("announcements of unshipped features live only in lib/upcoming.ts", () => {
  assert.ok(flagged('const a = "Housing is coming soon";'));
  assert.ok(flagged('const a = "找房功能即将上线";'));
  assert.ok(flagged('const a = "집 구하기 곧 출시";'));
  assert.ok(flagged('const a = "We’re testing shop sign-up";'));
  assert.ok(flagged('const a = "Próximamente: alquileres";'));
  // The app's own wording (Codex review of part 3, F2).
  assert.ok(flagged('const a = "附近店铺的各种优惠正在准备中";'));
  assert.ok(flagged('const a = "附近店家的各種優惠準備中";'));
  assert.ok(flagged('const a = "동네 가게의 다양한 혜택을 준비하고 있어요";'));
  assert.ok(!flagged('const a = "Housing is coming soon";', "lib/upcoming.ts"));
  assert.ok(!flagged('const a = "Sent successfully. We will get back to you soon.";'));
  assert.ok(!flagged('const a = "Esta página se actualizará pronto.";'));
});

test("upcoming lines render only in the listed page bodies", () => {
  const imp = 'import { upcomingLine } from "@/lib/upcoming";';
  assert.ok(flagged(imp, "app/(site)/[locale]/page.tsx"));
  assert.ok(flagged(imp, "lib/jsonld.ts"));
  assert.ok(flagged(imp, "components/comparison-gumtree-content.tsx"));
  assert.ok(!flagged(imp, "components/about-page-content.tsx"));
  assert.ok(!flagged('import { formatMonth } from "@/lib/locale-format";', "lib/jsonld.ts"));
  // Re-exports and dynamic imports count too (Codex review of part 3, F3).
  assert.ok(flagged('export { upcomingLine } from "@/lib/upcoming";', "lib/seo.ts"));
  assert.ok(flagged('const m = await import("@/lib/upcoming");', "app/sitemap.ts"));
});

test("each upcoming line is one sentence", () => {
  const one =
    'const u = { copy: { en: "As of {asOf}, it isn’t in the app yet, and “Coming soon!” is all it says." } };';
  const two =
    'const u = { copy: { en: "As of {asOf}, it isn’t in the app yet. Email us to hear more." } };';
  const ko =
    "const u = { copy: { ko: \"{asOf} 기준, 앱의 '집 구하기'는 아직 'Coming soon!' 페이지입니다.\" } };";
  assert.equal(findProblems("lib/upcoming.ts", one, "2026-10-24").length, 0);
  assert.ok(findProblems("lib/upcoming.ts", two, "2026-10-24").length > 0);
  assert.equal(findProblems("lib/upcoming.ts", ko, "2026-10-24").length, 0);
});

test("an upcoming line past its review date fails", () => {
  const src = 'const u = { reviewBy: "2026-12-31" };';
  assert.ok(findProblems("lib/upcoming.ts", src, "2027-01-01").length > 0);
  assert.equal(findProblems("lib/upcoming.ts", src, "2026-12-31").length, 0);
});
