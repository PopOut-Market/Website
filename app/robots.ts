import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * AI crawlers, split by what blocking them actually costs.
 *
 * RETRIEVAL / CITATION crawlers fetch a page at answer time so the assistant can
 * quote and link it. Blocking one of these removes the site from that assistant's
 * answers outright. TRAINING crawlers only feed model corpora — blocking them does
 * not remove the site from AI answers.
 *
 * All of these are already allowed by the `User-agent: *` group below. They are
 * listed explicitly so that (a) the intent is legible to whoever edits this next,
 * and (b) nobody "tidies up" by adding a blanket AI block without seeing the cost.
 */
const AI_RETRIEVAL_CRAWLERS = [
  "OAI-SearchBot", // ChatGPT Search — citation surface
  "ChatGPT-User", // ChatGPT browsing on a user's behalf
  "Claude-SearchBot", // Claude search — citation surface
  "Claude-User", // Claude browsing on a user's behalf
  "PerplexityBot", // Perplexity index
  "Perplexity-User", // Perplexity user-initiated fetch
  "Applebot", // Siri / Spotlight / Apple Intelligence
  "meta-webindexer", // Meta AI search — citation surface
] as const;

/**
 * SEARCH-ENGINE crawlers whose indexes the AI answers are built from: Google's
 * AI Overviews, AI Mode and Gemini answer from Googlebot's index, and Copilot
 * from Bingbot's. Brave Search, which Claude's web search uses, follows the
 * rules written for Googlebot. Blocking either one costs those AI answers as
 * well as the classic results.
 */
const SEARCH_INDEX_CRAWLERS = ["Googlebot", "Bingbot"] as const;

const AI_TRAINING_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "meta-externalagent",
] as const;

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl().replace(/\/$/, "");

  // NOTE: `/_next` is deliberately NOT disallowed.
  //
  // It holds the stylesheet, every JS chunk and the `/_next/image` optimiser.
  // Blocking it makes Googlebot render every page on the domain unstyled, stops
  // it ever hydrating a client-fetched feed, and makes every optimised image
  // (shopfront photos, listing thumbnails) permanently unindexable. Google's
  // guidance is explicit that render-critical resources must stay crawlable.
  // Do not re-add it — narrowing it to `/_next/static/chunks/` is not enough
  // either, because that still leaves `/_next/image` blocked.
  const disallow = ["/admin", "/admin-super", "/api"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: [...SEARCH_INDEX_CRAWLERS], allow: "/", disallow },
      { userAgent: [...AI_RETRIEVAL_CRAWLERS], allow: "/", disallow },
      { userAgent: [...AI_TRAINING_CRAWLERS], allow: "/", disallow },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
