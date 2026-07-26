#!/usr/bin/env node
/**
 * Verifies the two app-association files.
 *
 * A wrong or placeholder value here fails SILENTLY — iOS just opens the browser
 * instead of the app, with no error anywhere — which makes it the single most
 * common way Universal Links / App Links break. So check it deliberately.
 *
 *   npm run check:applinks          # file contents only (offline)
 *   npm run check:applinks -- --live  # also fetch both files on both hosts
 *
 * The live check asserts exactly what Apple and Google require: HTTP 200,
 * Content-Type application/json, and NO redirect — on www, the host the app
 * claims and shares links on. The apex is probed too but only reported, since
 * the app no longer claims it.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const AASA_PATH = join(ROOT, "public/.well-known/apple-app-site-association");
const ASSETLINKS_PATH = join(ROOT, "public/.well-known/assetlinks.json");

/**
 * The host the app actually claims. The mobile app shares and claims
 * www.popoutmarket.com.au, which is also this site's canonical host, so this is
 * the only host that has to serve the files cleanly.
 */
const REQUIRED_HOST = "https://www.popoutmarket.com.au";
/**
 * Reported but not enforced. The app no longer claims the apex, so a 301 here is
 * expected and fine — apex links simply redirect to www and land on the /l route
 * like any other browser hit. Shown only so a future apex claim is not debugged
 * from scratch.
 */
const INFO_HOST = "https://popoutmarket.com.au";
const PATHS = ["/.well-known/apple-app-site-association", "/.well-known/assetlinks.json"];

const APPLE_TEAM_ID_PATTERN = /^[A-Z0-9]{10}$/;
const SHA256_FINGERPRINT_PATTERN = /^(?:[A-F0-9]{2}:){31}[A-F0-9]{2}$/;

let failed = false;

function fail(message) {
  failed = true;
  console.error(`  FAIL  ${message}`);
}

function pass(message) {
  console.log(`  ok    ${message}`);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`${path}: not readable / not valid JSON — ${error.message}`);
    return null;
  }
}

console.log("apple-app-site-association");
const aasa = readJson(AASA_PATH);
if (aasa) {
  const details = aasa?.applinks?.details;
  if (!Array.isArray(details) || details.length === 0) {
    fail("applinks.details is missing or empty");
  } else {
    for (const detail of details) {
      const appId = String(detail.appID ?? "");
      const [teamId, ...bundleParts] = appId.split(".");
      const bundleId = bundleParts.join(".");

      if (appId.includes("REPLACE_ME")) {
        fail(
          `appID still holds a placeholder (${appId}). Apple Developer -> Membership -> Team ID (10 chars).`,
        );
      } else if (!APPLE_TEAM_ID_PATTERN.test(teamId)) {
        fail(`appID team prefix "${teamId}" is not a 10-character Apple Team ID`);
      } else {
        pass(`appID ${appId}`);
      }

      if (bundleId !== "au.com.popoutmarket") {
        fail(`bundle id is "${bundleId}", expected "au.com.popoutmarket"`);
      }
      const paths = detail.paths ?? detail.components;
      if (JSON.stringify(paths) !== JSON.stringify(["/l/*"])) {
        fail(
          `paths is ${JSON.stringify(paths)}, expected ["/l/*"] so only share links open the app`,
        );
      } else {
        pass('paths ["/l/*"]');
      }
    }
  }
}

console.log("assetlinks.json");
const assetlinks = readJson(ASSETLINKS_PATH);
if (assetlinks) {
  if (!Array.isArray(assetlinks) || assetlinks.length === 0) {
    fail("assetlinks.json must be a non-empty array");
  } else {
    for (const entry of assetlinks) {
      const target = entry?.target ?? {};
      if (target.namespace !== "android_app") {
        fail(`target.namespace is "${target.namespace}", expected "android_app"`);
      }
      if (target.package_name !== "au.com.popoutmarket") {
        fail(`target.package_name is "${target.package_name}", expected "au.com.popoutmarket"`);
      }
      const fingerprints = target.sha256_cert_fingerprints ?? [];
      for (const fingerprint of fingerprints) {
        if (String(fingerprint).includes("REPLACE_ME")) {
          fail(
            "sha256_cert_fingerprints still holds a placeholder. Play Console -> Setup -> App integrity -> App signing key certificate (the APP SIGNING key, NOT the upload key).",
          );
        } else if (!SHA256_FINGERPRINT_PATTERN.test(String(fingerprint))) {
          fail(
            `fingerprint "${fingerprint}" is not 32 uppercase hex byte pairs separated by colons`,
          );
        } else {
          pass(`fingerprint ${String(fingerprint).slice(0, 17)}...`);
        }
      }
    }
  }
}

if (process.argv.includes("--live")) {
  console.log(`live serving check (required host: ${REQUIRED_HOST})`);
  for (const path of PATHS) {
    const url = `${REQUIRED_HOST}${path}`;
    try {
      const response = await fetch(url, { redirect: "manual" });
      const contentType = response.headers.get("content-type") ?? "(none)";
      if (response.status !== 200) {
        fail(
          `${url} -> ${response.status} ${response.headers.get("location") ?? ""} (must be 200 with no redirect; Apple/Google do not follow redirects)`,
        );
      } else if (!contentType.includes("application/json")) {
        fail(`${url} -> 200 but Content-Type is "${contentType}", expected application/json`);
      } else {
        pass(`${url} -> 200 ${contentType}`);
      }
    } catch (error) {
      fail(`${url} -> request failed: ${error.message}`);
    }
  }

  console.log(`apex (informational only — the app does not claim ${INFO_HOST})`);
  for (const path of PATHS) {
    const url = `${INFO_HOST}${path}`;
    try {
      const response = await fetch(url, { redirect: "manual" });
      const location = response.headers.get("location");
      console.log(`  info  ${url} -> ${response.status}${location ? ` ${location}` : ""}`);
    } catch (error) {
      console.log(`  info  ${url} -> request failed: ${error.message}`);
    }
  }
}

if (failed) {
  console.error("\napp-links check FAILED");
  process.exit(1);
}
console.log("\napp-links check passed");
