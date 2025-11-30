const { existsSync, rmSync } = require("fs");
const path = require("path");

const cacheDir = path.join(process.cwd(), ".next", "cache");

try {
  if (!existsSync(cacheDir)) {
    console.log("[postbuild] No .next/cache directory detected, skipping cleanup.");
    process.exit(0);
  }

  rmSync(cacheDir, { recursive: true, force: true });
  console.log(`[postbuild] Removed Next.js cache directory at ${cacheDir}`);
} catch (error) {
  console.error("[postbuild] Failed to remove .next/cache:", error);
  process.exit(1);
}
