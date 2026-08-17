import { initTRPC, TRPCError } from "@trpc/server";
import { timingSafeEqual } from "node:crypto";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

/**
 * Shared app-level gate for scan operations and stored intelligence.
 * This is intentionally separate from `publicQuery` so health/source discovery
 * can remain public while sensitive operations require explicit configuration.
 */
export const protectedQuery = t.procedure.use(({ ctx, next }) => {
  const expectedToken = process.env.OSINT_ACCESS_TOKEN;
  const providedToken = ctx.req.headers.get("x-osint-access-token");

  if (!expectedToken || expectedToken.length < 32) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "OSINT_ACCESS_TOKEN must be configured with at least 32 characters",
    });
  }

  if (!providedToken) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "OSINT access token required" });
  }

  const expected = Buffer.from(expectedToken);
  const provided = Buffer.from(providedToken);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid OSINT access token" });
  }

  return next();
});
