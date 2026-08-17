import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { scans, scanResults } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { spawn } from "child_process";
import fs from "fs";

// Helper to run a shell command and return output
async function runCommand(command: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args);
    let output = "";
    let error = "";

    process.stdout.on("data", (data) => (output += data.toString()));
    process.stderr.on("data", (data) => (error += data.toString()));

    process.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(error || `Process exited with code ${code}`));
    });
  });
}

export const osintRouter = createRouter({
  // Start a scan with a specific tool
  startScan: publicQuery
    .input(
      z.object({
        // theHarvester scans use harvesterRouter.scan; this procedure handles only tools implemented below.
        tool: z.enum(["amass", "sherlock", "nuclei"] as const),
        target: z.string().min(1),
        options: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Create scan record
      await db.insert(scans).values({
        tool: input.tool,
        domain: input.target,
        sources: JSON.stringify(input.options || {}),
        status: "running",
      });

      const scan = await db.select().from(scans)
        .where(eq(scans.domain, input.target))
        .orderBy(desc(scans.createdAt))
        .limit(1)
        .then((r) => r[0]);

      // Start execution in background
      (async () => {
        try {
          if (input.tool === "amass") {
            const args = ["enum", "-d", input.target, "-json", "output.json"];
            const output = await runCommand("amass", args);
            const results = output.split("\n").filter(l => l.trim()).map(l => JSON.parse(l));
            for (const res of results) {
              await db.insert(scanResults).values({
                scanId: scan.id,
                resultType: "amass_discovery",
                data: res,
              });
            }
          } else if (input.tool === "sherlock") {
            const args = [input.target, "--json", "output.json"];
            await runCommand("sherlock", args);
            // Sherlock saves to a file, we'd read it here
            const results = JSON.parse(fs.readFileSync("output.json", "utf-8"));
            for (const [site, data] of Object.entries(results)) {
              await db.insert(scanResults).values({
                scanId: scan.id,
                resultType: "sherlock_account",
                data: { site, ...(data as object) },
              });
            }
          } else if (input.tool === "nuclei") {
            const args = ["-target", input.target, "-json-export", "output.json"];
            await runCommand("nuclei", args);
            const output = fs.readFileSync("output.json", "utf-8");
            const results = output.split("\n").filter(l => l.trim()).map(l => JSON.parse(l));
            for (const res of results) {
              await db.insert(scanResults).values({
                scanId: scan.id,
                resultType: "nuclei_vulnerability",
                data: res,
              });
            }
          }
          
          await db.update(scans).set({ status: "completed" }).where(eq(scans.id, scan.id));
        } catch (error) {
          console.error(`Scan failed for ${input.tool}:`, error);
          await db.update(scans).set({ status: "failed" }).where(eq(scans.id, scan.id));
        }
      })();

      return { scanId: scan.id };
    }),

  // Get all scans
  getScans: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(scans).orderBy(desc(scans.createdAt));
  }),

  // Get results for a specific scan
  getResults: publicQuery
    .input(z.object({ scanId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const scan = await db.select().from(scans).where(eq(scans.id, input.scanId)).then((r) => r[0]);
      const results = await db.select().from(scanResults).where(eq(scanResults.scanId, input.scanId));
      return { scan, results };
    }),
});
