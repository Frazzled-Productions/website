// Click counts: the site's replacement for Vercel Analytics custom events.
//
// `sendEvent` (browser) beacons one of two fixed names to `/api/event`; `handleEvent` (the
// Worker, via app/api/event/route.ts) adds one to that name's total for the UTC day in the
// `event_counts` D1 table (migrations/0001_event_counts.sql). Nothing personal is read or
// kept: no IP address, user agent, page address, referrer, cookie or time finer than the day.
// Kept free of Next and Cloudflare imports so tests/events.test.ts can run it under plain Node.

/** The only click names the site sends and the endpoint accepts. */
export const EVENT_NAMES = ['support_click', 'pokememory_click'] as const;

export type EventName = (typeof EVENT_NAMES)[number];

/** The bindings the endpoint needs, typed by shape so the tests can pass fakes. */
export type EventEnv = {
  EVENTS_DB: {
    prepare(sql: string): { bind(...values: unknown[]): { run(): Promise<unknown> } };
  };
  EVENT_LIMITER: { limit(options: { key: string }): Promise<{ success: boolean }> };
};

const MAX_BODY_BYTES = 200;

const UPSERT =
  'INSERT INTO event_counts (day, name, count) VALUES (?1, ?2, 1) ' +
  'ON CONFLICT (day, name) DO UPDATE SET count = count + 1';

function isEventName(value: unknown): value is EventName {
  return typeof value === 'string' && (EVENT_NAMES as readonly string[]).includes(value);
}

function reply(status: number): Response {
  return new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });
}

/**
 * Handles `POST /api/event`. Reads only the `Origin` and `Content-Length` headers and the
 * body, logs nothing, and answers with no body and no cookie: 204 counted, 400 bad body,
 * 403 another origin, 405 not POST, 429 rate-limited, 503 database error.
 */
export async function handleEvent(
  request: Request,
  env: EventEnv,
  now: Date = new Date(),
): Promise<Response> {
  if (request.method !== 'POST') return reply(405);

  if (request.headers.get('Origin') !== new URL(request.url).origin) return reply(403);

  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY_BYTES) return reply(400);
  const body = await request.text();
  if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) return reply(400);

  let name: unknown;
  try {
    name = (JSON.parse(body) as { name?: unknown } | null)?.name;
  } catch {
    return reply(400);
  }
  if (!isEventName(name)) return reply(400);

  // Keyed by event name, never by IP address (proposal Clarifications, call 2).
  const { success } = await env.EVENT_LIMITER.limit({ key: name });
  if (!success) return reply(429);

  const day = now.toISOString().slice(0, 10);
  try {
    await env.EVENTS_DB.prepare(UPSERT).bind(day, name).run();
  } catch {
    return reply(503);
  }
  return reply(204);
}

/**
 * Sends one click name to the site's own endpoint. Fire and forget: does nothing where
 * `navigator.sendBeacon` is missing, and never throws, so a click always behaves as normal.
 */
export function sendEvent(name: EventName): void {
  try {
    if (typeof navigator === 'undefined' || typeof navigator?.sendBeacon !== 'function') return;
    navigator.sendBeacon('/api/event', new Blob([JSON.stringify({ name })], { type: 'application/json' }));
  } catch {
    // Counting is best effort; the click itself must never fail.
  }
}
// Preview proof for ops #612: throwaway branch, closed unmerged.
