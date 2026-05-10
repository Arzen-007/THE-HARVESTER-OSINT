import { createRouter, publicQuery } from "./middleware";
import { harvesterRouter } from "./harvester";
import { osintRouter } from "./osint";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  harvester: harvesterRouter,
  osint: osintRouter,
});

export type AppRouter = typeof appRouter;
