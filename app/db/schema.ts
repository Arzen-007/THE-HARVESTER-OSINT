import {
  mysqlTable,
  serial,
  bigint,
  varchar,
  text,
  timestamp,
  json,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const scans = mysqlTable("scans", {
  id: serial("id").primaryKey(),
  domain: varchar("domain", { length: 255 }).notNull(),
  sources: text("sources").notNull(),
  status: mysqlEnum("status", ["pending", "running", "completed", "failed"]).notNull().default("pending"),
  limit: varchar("limit", { length: 10 }).notNull().default("500"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const scanResults = mysqlTable("scan_results", {
  id: serial("id").primaryKey(),
  scanId: bigint("scan_id", { mode: "number", unsigned: true }).references(() => scans.id),
  resultType: mysqlEnum("result_type", [
    "emails",
    "hosts",
    "ips",
    "linkedin_people",
    "twitter_people",
    "interesting_urls",
    "asns",
    "linkedin_links",
    "trello_urls",
  ]).notNull(),
  data: json("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
