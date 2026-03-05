import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

// Auth.js tables
export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  password: text("password"),
});

export const accounts = sqliteTable("account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = sqliteTable("session", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

// Application tables
export const sites = sqliteTable("site", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  createdAt: text("createdAt")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const events = sqliteTable(
  "event",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    siteId: text("siteId")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    path: text("path").notNull(),
    referrer: text("referrer"),
    browser: text("browser"),
    os: text("os"),
    country: text("country"),
    city: text("city"),
    device: text("device"),
    duration: integer("duration"),
    revenue: integer("revenue"),
    metadata: text("metadata"),
    timestamp: text("timestamp").notNull(),
  },
  (table) => [
    index("event_site_timestamp_idx").on(table.siteId, table.timestamp),
    index("event_site_name_idx").on(table.siteId, table.name),
    index("event_site_path_idx").on(table.siteId, table.path),
    index("event_site_name_ts_idx").on(table.siteId, table.name, table.timestamp),
  ]
);

export const dashboards = sqliteTable("dashboard", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  siteId: text("siteId")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  layout: text("layout"),
  createdAt: text("createdAt")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updatedAt")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const widgets = sqliteTable("widget", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  dashboardId: text("dashboardId")
    .notNull()
    .references(() => dashboards.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  config: text("config"),
  position: integer("position").notNull().default(0),
  createdAt: text("createdAt")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
