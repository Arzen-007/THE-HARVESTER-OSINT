import { z } from "zod";
import { createRouter, publicQuery, protectedQuery } from "./middleware";
import { spawn } from "child_process";
import path from "path";
import { getDb } from "./queries/connection";
import { scans, scanResults } from "@db/schema";
import { eq, desc } from "drizzle-orm";

let apiPort = 5000;

async function ensureHarvesterApi() {
  // Check if API is already running
  try {
    const response = await fetch(`http://127.0.0.1:${apiPort}/sources`, { method: "GET" });
    if (response.ok) return;
  } catch (_e) {
    // Not running, start it
  }

  // Start the API server
  spawn(
    "python",
    ["-m", "theHarvester.restfulHarvest", "-H", "127.0.0.1", "-p", String(apiPort), "-l", "warning"],
    {
      detached: true,
      stdio: "ignore",
      cwd: path.join(process.cwd(), "..", "theHarvester"),
      env: { ...process.env, PYTHONPATH: path.join(process.cwd(), "..", "theHarvester") },
    }
  );

  // Wait for server to start
  let retries = 10;
  while (retries > 0) {
    try {
      const response = await fetch(`http://127.0.0.1:${apiPort}/sources`, { method: "GET" });
      if (response.ok) break;
    } catch (_e) {
      // Not ready yet
    }
    await new Promise((r) => setTimeout(r, 1000));
    retries--;
  }
}

export const harvesterRouter = createRouter({
  // Get available sources
  sources: publicQuery.query(async () => {
    await ensureHarvesterApi();
    const response = await fetch(`http://127.0.0.1:${apiPort}/sources`);
    if (!response.ok) throw new Error("Failed to fetch sources");
    return response.json() as Promise<{ sources: string[] }>;
  }),

  // Start a new scan
  scan: protectedQuery
    .input(
      z.object({
        domain: z.string().min(3),
        sources: z.array(z.string()).min(1),
        limit: z.number().min(1).max(2000).default(500),
        start: z.number().min(0).default(0),
        dnsBrute: z.boolean().default(false),
        dnsLookup: z.boolean().default(false),
        dnsResolve: z.string().default(""),
        shodan: z.boolean().default(false),
        takeOver: z.boolean().default(false),
        proxies: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      await ensureHarvesterApi();

      const db = getDb();

      // Create scan record
      await db.insert(scans).values({
        domain: input.domain,
        sources: input.sources.join(","),
        status: "running",
        limit: String(input.limit),
      });

      // Get the inserted scan
      const scan = await db.select().from(scans)
        .where(eq(scans.domain, input.domain))
        .orderBy(desc(scans.createdAt))
        .limit(1)
        .then((r) => r[0]);

      try {
        // Build query params
        const params = new URLSearchParams();
        params.append("domain", input.domain);
        params.append("limit", String(input.limit));
        params.append("start", String(input.start));
        params.append("dns_brute", String(input.dnsBrute));
        params.append("dns_lookup", String(input.dnsLookup));
        params.append("dns_resolve", input.dnsResolve);
        params.append("shodan", String(input.shodan));
        params.append("take_over", String(input.takeOver));
        params.append("proxies", String(input.proxies));
        input.sources.forEach((s) => params.append("source", s));

        const response = await fetch(`http://127.0.0.1:${apiPort}/query?${params.toString()}`, {
          method: "GET",
        });

        if (!response.ok) {
          const err = await response.json() as { detail?: string };
          throw new Error(err.detail || "Scan failed");
        }

        const data = await response.json() as Record<string, string[]>;

        // Save results
        const resultTypes = [
          { key: "emails", type: "emails" as const },
          { key: "hosts", type: "hosts" as const },
          { key: "ips", type: "ips" as const },
          { key: "linkedin_people", type: "linkedin_people" as const },
          { key: "twitter_people", type: "twitter_people" as const },
          { key: "interesting_urls", type: "interesting_urls" as const },
          { key: "asns", type: "asns" as const },
          { key: "linkedin_links", type: "linkedin_links" as const },
          { key: "trello_urls", type: "trello_urls" as const },
        ];

        for (const rt of resultTypes) {
          const items = data[rt.key];
          if (items && items.length > 0) {
            await db.insert(scanResults).values({
              scanId: scan.id,
              resultType: rt.type,
              data: items,
            });
          }
        }

        await db.update(scans).set({ status: "completed" }).where(eq(scans.id, scan.id));

        return { scanId: scan.id, results: data };
      } catch (error: unknown) {
        await db.update(scans).set({ status: "failed" }).where(eq(scans.id, scan.id));
        const msg = error instanceof Error ? error.message : "Scan failed";
        throw new Error(msg);
      }
    }),

  // Get scan history
  scanHistory: protectedQuery.query(async () => {
    const db = getDb();
    return db.select().from(scans).orderBy(desc(scans.createdAt));
  }),

  // Get scan results
  getScanResults: protectedQuery
    .input(z.object({ scanId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const scan = await db.select().from(scans).where(eq(scans.id, input.scanId)).then((r) => r[0]);
      const results = await db
        .select()
        .from(scanResults)
        .where(eq(scanResults.scanId, input.scanId));

      return { scan, results };
    }),

  // DNS Brute force
  dnsBrute: protectedQuery
    .input(
      z.object({
        domain: z.string().min(3),
        dnsResolve: z.string().default(""),
      })
    )
    .mutation(async ({ input }) => {
      await ensureHarvesterApi();

      const params = new URLSearchParams();
      params.append("domain", input.domain);
      params.append("dns_resolve", input.dnsResolve);

      const response = await fetch(`http://127.0.0.1:${apiPort}/dnsbrute?${params.toString()}`, {
        method: "GET",
      });

      if (!response.ok) {
        const err = await response.json() as { detail?: string };
        throw new Error(err.detail || "DNS brute force failed");
      }

      return response.json();
    }),
});
