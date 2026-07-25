'use client';

type Task = {
  run: () => Promise<Response>;
  priority: number;
  resolve: (res: Response) => void;
  reject: (err: unknown) => void;
};

const MAX_CONCURRENT = 4;

let active = 0;
let resumeAt = 0;
const queue: Task[] = [];

async function getRetryAfterSeconds(res: Response): Promise<number> {
  try {
    const body = await res.clone().json();
    if (typeof body?.retryAfter === 'number') return body.retryAfter;
  } catch {
    // ignore, fall through to default
  }
  return 5; // sensible default if the server didn't tell us
}

function drain() {
  const now = Date.now();

  if (now < resumeAt) {
    // whole queue is paused (we got a 429) — try again once the cooldown ends
    setTimeout(drain, resumeAt - now);
    return;
  }

  while (active < MAX_CONCURRENT && queue.length > 0) {
    queue.sort((a, b) => a.priority - b.priority);
    const task = queue.shift()!;
    active++;

    task
      .run()
      .then(async res => {
        if (res.status === 429) {
          const retryAfter = await getRetryAfterSeconds(res);
          resumeAt = Date.now() + retryAfter * 1000;
          queue.push(task); // put it back, don't resolve/reject yet
          return;
        }
        task.resolve(res);
      })
      .catch(err => task.reject(err))
      .finally(() => {
        active--;
        drain();
      });
  }
}

/**
 * Routes a fetch through a shared, page-wide concurrency-limited queue.
 * - Only MAX_CONCURRENT requests run at once, lowest `priority` first.
 * - On a 429, the ENTIRE queue pauses for the server-specified retryAfter
 *   (or a 5s default), then resumes — since a rate limit hit by one
 *   request means the others would likely hit it too.
 *
 * priority: lower runs first (e.g. above-the-fold sections = 1, 2, 3...)
 */
export function scheduledFetch(
  run: () => Promise<Response>,
  priority = 0
): Promise<Response> {
  return new Promise((resolve, reject) => {
    queue.push({ run, priority, resolve, reject });
    drain();
  });
}