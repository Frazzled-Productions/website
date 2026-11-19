// OpenNext for Cloudflare (design D2). Every page is prerendered and nothing revalidates, so the
// incremental cache reads the prerendered pages straight from the Worker's static assets.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
