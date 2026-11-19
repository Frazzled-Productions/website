// POST /api/event: counts a click on one of the two known links (logic in app/lib/events.ts).
// Other methods get Next's own 405, since only POST is exported.
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { handleEvent, type EventEnv } from "../../lib/events";

export async function POST(request: Request): Promise<Response> {
  const { env } = await getCloudflareContext({ async: true });
  return handleEvent(request, env as unknown as EventEnv);
}
