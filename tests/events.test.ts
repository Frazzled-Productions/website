// Tests for the click-count endpoint and client helper in app/lib/events.ts.
// Run with `npm test` (Node's built-in runner, Node 24 type stripping, no extra dependency).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EVENT_NAMES, handleEvent, sendEvent, type EventEnv } from '../app/lib/events.ts';

const SITE = 'https://frazzledproductions.com';

type Call = { sql: string; args: unknown[] };

/** A fake D1 database that keeps the daily totals in a Map, the way the real upsert would. */
function fakeDb(options: { fail?: boolean } = {}) {
  const calls: Call[] = [];
  const totals = new Map<string, number>();
  const db = {
    prepare(sql: string) {
      return {
        bind(...args: unknown[]) {
          return {
            async run() {
              calls.push({ sql, args });
              if (options.fail) throw new Error('D1_ERROR: daily write limit reached');
              const key = `${args[0]}|${args[1]}`;
              totals.set(key, (totals.get(key) ?? 0) + 1);
              return { success: true };
            },
          };
        },
      };
    },
  };
  return { db, calls, totals };
}

function fakeLimiter(allow = true) {
  const keys: string[] = [];
  return {
    limiter: {
      async limit({ key }: { key: string }) {
        keys.push(key);
        return { success: allow };
      },
    },
    keys,
  };
}

function makeEnv(options: { allow?: boolean; failDb?: boolean } = {}) {
  const d1 = fakeDb({ fail: options.failDb });
  const rl = fakeLimiter(options.allow ?? true);
  const env = { EVENTS_DB: d1.db, EVENT_LIMITER: rl.limiter } as unknown as EventEnv;
  return { env, d1, rl };
}

function post(body: string, origin: string | null = SITE, method = 'POST') {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (origin !== null) headers.set('Origin', origin);
  return new Request(`${SITE}/api/event`, {
    method,
    headers,
    body: method === 'GET' || method === 'HEAD' ? undefined : body,
  });
}

const NOW = new Date('2026-11-19T21:30:00Z');

test('the allowlist is exactly the two known click names', () => {
  assert.deepEqual([...EVENT_NAMES].sort(), ['pokememory_click', 'support_click']);
});

test('a known name from the site itself is counted: 204, no-store, no cookie, one upsert', async () => {
  const { env, d1, rl } = makeEnv();
  const res = await handleEvent(post('{"name":"support_click"}'), env, NOW);
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('Cache-Control'), 'no-store');
  assert.equal(res.headers.get('Set-Cookie'), null);
  assert.equal(d1.calls.length, 1);
  assert.match(d1.calls[0].sql, /INSERT INTO event_counts/);
  assert.match(d1.calls[0].sql, /ON CONFLICT \(day, name\) DO UPDATE SET count = count \+ 1/);
  assert.deepEqual(rl.keys, ['support_click']);
});

test('the second known name is counted too', async () => {
  const { env, d1 } = makeEnv();
  const res = await handleEvent(post('{"name":"pokememory_click"}'), env, NOW);
  assert.equal(res.status, 204);
  assert.deepEqual(d1.calls[0].args, ['2026-11-19', 'pokememory_click']);
});

test('the SQL binds only the UTC day and the name', async () => {
  const { env, d1 } = makeEnv();
  // 23:30 in London on 19 November is still 19 November in UTC; 00:30 UTC the next day is the 20th.
  await handleEvent(post('{"name":"support_click"}'), env, new Date('2026-11-20T00:30:00Z'));
  assert.deepEqual(d1.calls[0].args, ['2026-11-20', 'support_click']);
});

test('two clicks on the same UTC day give a count of 2 and touch no other row', async () => {
  const { env, d1 } = makeEnv();
  await handleEvent(post('{"name":"support_click"}'), env, NOW);
  await handleEvent(post('{"name":"support_click"}'), env, new Date('2026-11-19T08:00:00Z'));
  assert.equal(d1.totals.get('2026-11-19|support_click'), 2);
  assert.equal(d1.totals.size, 1);
});

test('an unknown name gets 400 and nothing is written', async () => {
  const { env, d1, rl } = makeEnv();
  const res = await handleEvent(post('{"name":"foo"}'), env, NOW);
  assert.equal(res.status, 400);
  assert.equal(d1.calls.length, 0);
  assert.equal(rl.keys.length, 0);
});

test('a body that is not JSON, or has no name, gets 400', async () => {
  for (const body of ['not json', '{}', '{"name":1}', '["support_click"]', 'null']) {
    const { env, d1 } = makeEnv();
    const res = await handleEvent(post(body), env, NOW);
    assert.equal(res.status, 400, body);
    assert.equal(d1.calls.length, 0, body);
  }
});

test('a 201-byte body gets 400 and nothing is written', async () => {
  const { env, d1 } = makeEnv();
  const prefix = '{"name":"support_click","pad":"';
  const padded = prefix + 'x'.repeat(201 - prefix.length - 2) + '"}';
  assert.equal(new TextEncoder().encode(padded).length, 201);
  const res = await handleEvent(post(padded), env, NOW);
  assert.equal(res.status, 400);
  assert.equal(d1.calls.length, 0);
});

test('another origin gets 403 and nothing is written', async () => {
  const { env, d1 } = makeEnv();
  const res = await handleEvent(post('{"name":"support_click"}', 'https://evil.example'), env, NOW);
  assert.equal(res.status, 403);
  assert.equal(d1.calls.length, 0);
});

test('a missing Origin header gets 403', async () => {
  const { env, d1 } = makeEnv();
  const res = await handleEvent(post('{"name":"support_click"}', null), env, NOW);
  assert.equal(res.status, 403);
  assert.equal(d1.calls.length, 0);
});

test('GET gets 405', async () => {
  const { env, d1 } = makeEnv();
  const res = await handleEvent(post('', SITE, 'GET'), env, NOW);
  assert.equal(res.status, 405);
  assert.equal(d1.calls.length, 0);
});

test('the rate limit is keyed by event name; a refusal gets 429 and no write', async () => {
  const { env, d1, rl } = makeEnv({ allow: false });
  const res = await handleEvent(post('{"name":"pokememory_click"}'), env, NOW);
  assert.equal(res.status, 429);
  assert.equal(d1.calls.length, 0);
  assert.deepEqual(rl.keys, ['pokememory_click']);
});

test('a failing database gives 503, still with no cookie', async () => {
  const { env } = makeEnv({ failDb: true });
  const res = await handleEvent(post('{"name":"support_click"}'), env, NOW);
  assert.equal(res.status, 503);
  assert.equal(res.headers.get('Set-Cookie'), null);
});

test('no response from the endpoint sets a cookie', async () => {
  const cases: Array<[Request, { allow?: boolean; failDb?: boolean }]> = [
    [post('{"name":"support_click"}'), {}],
    [post('{"name":"foo"}'), {}],
    [post('{"name":"support_click"}', 'https://evil.example'), {}],
    [post('', SITE, 'GET'), {}],
    [post('{"name":"support_click"}'), { allow: false }],
    [post('{"name":"support_click"}'), { failDb: true }],
  ];
  for (const [req, opts] of cases) {
    const { env } = makeEnv(opts);
    const res = await handleEvent(req, env, NOW);
    assert.equal(res.headers.get('Set-Cookie'), null, `status ${res.status}`);
    assert.equal(res.headers.get('Cache-Control'), 'no-store', `status ${res.status}`);
  }
});

test('sendEvent beacons the name as JSON to /api/event', async () => {
  const sent: Array<{ url: string; data: Blob }> = [];
  const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
      sendBeacon(url: string, data: Blob) {
        sent.push({ url, data });
        return true;
      },
    },
  });
  try {
    sendEvent('support_click');
  } finally {
    if (original) Object.defineProperty(globalThis, 'navigator', original);
  }
  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, '/api/event');
  assert.equal(sent[0].data.type, 'application/json');
  assert.equal(await sent[0].data.text(), '{"name":"support_click"}');
});

test('sendEvent with no navigator.sendBeacon does nothing and does not throw', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  try {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {} });
    assert.doesNotThrow(() => sendEvent('pokememory_click'));
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: undefined });
    assert.doesNotThrow(() => sendEvent('pokememory_click'));
  } finally {
    if (original) Object.defineProperty(globalThis, 'navigator', original);
  }
});

test('wrangler.jsonc gives production and preview the bindings the endpoint reads', async () => {
  const { readFileSync } = await import('node:fs');
  // wrangler.jsonc only has whole-line comments, so dropping them leaves plain JSON.
  const text = readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8')
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n');
  const config = JSON.parse(text);
  const required: Array<keyof EventEnv> = ['EVENTS_DB', 'EVENT_LIMITER'];
  for (const [label, scope] of [['production', config], ['preview', config.env.preview]]) {
    const bindings = [
      ...scope.d1_databases.map((db: { binding: string }) => db.binding),
      ...scope.ratelimits.map((rl: { name: string }) => rl.name),
    ];
    for (const name of required) assert.ok(bindings.includes(name), `${label} lacks ${name}`);
  }
  assert.notEqual(config.d1_databases[0].database_name, config.env.preview.d1_databases[0].database_name);
  assert.notEqual(config.ratelimits[0].namespace_id, config.env.preview.ratelimits[0].namespace_id);
});
