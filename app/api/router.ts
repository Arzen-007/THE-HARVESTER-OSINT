import { createRouter, publicQuery } from "./middleware";
import { harvesterRouter } from "./harvester";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  harvester: harvesterRouter,
});

export type AppRouter = typeof appRouter;
