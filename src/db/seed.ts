import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { users, sites, events, dashboards, widgets } from "./schema";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client);

// Weighted random selection helper
function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  console.log("Seeding database...");

  // Clean existing data
  console.log("Cleaning existing data...");
  await db.delete(widgets);
  await db.delete(dashboards);
  await db.delete(events);
  await db.delete(sites);
  await db.delete(users);

  // Test user
  const userId = nanoid();
  const hashedPassword = await bcrypt.hash("password123", 10);

  await db.insert(users).values({
    id: userId,
    name: "Demo User",
    email: "demo@example.com",
    password: hashedPassword,
  });
  console.log("Created test user: demo@example.com / password123");

  // Demo site
  const siteId = nanoid();
  await db.insert(sites).values({
    id: siteId,
    userId,
    name: "My App",
    domain: "myapp.com",
  });
  console.log("Created demo site: My App (myapp.com)");

  // Demo dashboard
  const dashboardId = nanoid();
  await db.insert(dashboards).values({
    id: dashboardId,
    siteId,
    name: "Overview",
  });

  // Demo widgets
  const widgetConfigs = [
    { type: "metric_card", title: "Total Pageviews", config: JSON.stringify({ metric: "pageviews" }), position: 0 },
    { type: "metric_card", title: "Unique Visitors", config: JSON.stringify({ metric: "visitors" }), position: 1 },
    { type: "metric_card", title: "Avg Duration", config: JSON.stringify({ metric: "avg_duration" }), position: 2 },
    { type: "metric_card", title: "Bounce Rate", config: JSON.stringify({ metric: "bounce_rate" }), position: 3 },
    { type: "line_chart", title: "Pageviews Over Time", config: JSON.stringify({ metric: "pageviews", groupBy: "date" }), position: 4 },
    { type: "bar_chart", title: "Top Pages", config: JSON.stringify({ metric: "pageviews", groupBy: "path" }), position: 5 },
    { type: "pie_chart", title: "Browsers", config: JSON.stringify({ metric: "pageviews", groupBy: "browser" }), position: 6 },
    { type: "pie_chart", title: "Devices", config: JSON.stringify({ metric: "pageviews", groupBy: "device" }), position: 7 },
  ];

  for (const w of widgetConfigs) {
    await db.insert(widgets).values({ id: nanoid(), dashboardId, ...w });
  }
  console.log("Created default dashboard with widgets");

  // Event data distributions
  const paths = [
    "/home", "/pricing", "/about", "/blog", "/docs", "/signup", "/login",
    "/dashboard", "/settings", "/contact", "/blog/post-1", "/blog/post-2",
    "/features", "/changelog", "/api-docs",
  ];

  const eventTypes = ["pageview", "click", "signup", "purchase"];
  const eventWeights = [70, 15, 10, 5];

  const referrers = ["google.com", "twitter.com", "github.com", "direct", "producthunt.com", "reddit.com", "hackernews"];
  const referrerWeights = [30, 15, 15, 20, 8, 7, 5];

  const browsers = ["Chrome", "Safari", "Firefox", "Edge"];
  const browserWeights = [60, 20, 15, 5];

  const oses = ["Windows", "macOS", "iOS", "Android"];
  const osWeights = [35, 30, 20, 15];

  const devices = ["desktop", "mobile", "tablet"];
  const deviceWeights = [55, 35, 10];

  const countries = ["US", "GB", "DE", "FR", "CA", "AU", "IN", "JP", "BR", "NL"];
  const countryWeights = [40, 15, 10, 8, 7, 5, 5, 5, 3, 2];

  const cities: Record<string, string[]> = {
    US: ["New York", "San Francisco", "Los Angeles", "Chicago", "Austin"],
    GB: ["London", "Manchester", "Birmingham"],
    DE: ["Berlin", "Munich", "Hamburg"],
    FR: ["Paris", "Lyon", "Marseille"],
    CA: ["Toronto", "Vancouver", "Montreal"],
    AU: ["Sydney", "Melbourne"],
    IN: ["Mumbai", "Bangalore", "Delhi"],
    JP: ["Tokyo", "Osaka"],
    BR: ["Sao Paulo", "Rio de Janeiro"],
    NL: ["Amsterdam", "Rotterdam"],
  };

  // Generate events
  const TOTAL_EVENTS = 12000;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const eventBatch: (typeof events.$inferInsert)[] = [];

  for (let i = 0; i < TOTAL_EVENTS; i++) {
    const eventName = weightedRandom(eventTypes, eventWeights);
    const country = weightedRandom(countries, countryWeights);
    const countryCities = cities[country] || ["Unknown"];
    const city = countryCities[randomInt(0, countryCities.length - 1)];

    // Realistic timestamp: more on weekdays, peak 9-17 UTC
    const dayOffset = randomInt(0, 29);
    const date = new Date(thirtyDaysAgo.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    const dayOfWeek = date.getDay();

    // Weekday bias: skip ~30% of weekend events
    if ((dayOfWeek === 0 || dayOfWeek === 6) && Math.random() < 0.3) {
      continue;
    }

    // Hour distribution: peak 9-17 UTC
    let hour: number;
    if (Math.random() < 0.65) {
      hour = randomInt(9, 17); // peak hours
    } else if (Math.random() < 0.7) {
      hour = randomInt(7, 21); // shoulder hours
    } else {
      hour = randomInt(0, 23); // any hour
    }

    date.setUTCHours(hour, randomInt(0, 59), randomInt(0, 59));

    const referrer = weightedRandom(referrers, referrerWeights);

    eventBatch.push({
      id: nanoid(),
      siteId,
      name: eventName,
      path: paths[randomInt(0, paths.length - 1)],
      referrer: referrer === "direct" ? null : referrer,
      browser: weightedRandom(browsers, browserWeights),
      os: weightedRandom(oses, osWeights),
      country,
      city,
      device: weightedRandom(devices, deviceWeights),
      duration: eventName === "pageview" ? randomInt(5, 300) : null,
      revenue: eventName === "purchase" ? randomInt(1000, 10000) : null,
      metadata: null,
      timestamp: date.toISOString(),
    });
  }

  // Batch insert in chunks of 500
  const BATCH_SIZE = 500;
  for (let i = 0; i < eventBatch.length; i += BATCH_SIZE) {
    const chunk = eventBatch.slice(i, i + BATCH_SIZE);
    await db.insert(events).values(chunk);
    console.log(`Inserted events ${i + 1}-${Math.min(i + BATCH_SIZE, eventBatch.length)} of ${eventBatch.length}`);
  }

  console.log(`\nSeeding complete! ${eventBatch.length} events created.`);
  client.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
