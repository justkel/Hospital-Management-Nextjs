import { NextResponse } from 'next/server';
import { GraphQLErrorShape } from './handle-graphql-error';

export type GraphQLResponseShape<T> = {
  data?: T;
  errors?: GraphQLErrorShape[];
};

type GatewayResult<T> =
  | { ok: true; json: GraphQLResponseShape<T> }
  | { ok: false; response: NextResponse };

/**
 * Wraps a raw gateway fetch response. The gateway can fail in two
 * different shapes:
 *  - a normal GraphQL response with a populated `errors` array (handled
 *    downstream by handleGraphQLError)
 *  - a non-2xx response that ISN'T GraphQL-shaped at all, e.g. a 429
 *    from rate limiting: { statusCode: 429, message: "..." }
 *
 * Previously routes called res.json() unconditionally and treated it as
 * GraphQL, which silently swallowed things like 429s into a generic 500.
 * This preserves the real upstream status so callers (and the client
 * scheduler) can react to it correctly.
 */
export async function parseGatewayResponse<T>(
  res: Response
): Promise<GatewayResult<T>> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as Record<string, unknown>);
    const retryAfter = getRetryAfterSeconds(res, body);

    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            typeof body?.message === 'string'
              ? body.message
              : 'Upstream request failed',
          ...(res.status === 429 && retryAfter != null ? { retryAfter } : {}),
        },
        { status: res.status }
      ),
    };
  }

  const json: GraphQLResponseShape<T> = await res.json().catch(() => ({}));
  return { ok: true, json };
}

function getRetryAfterSeconds(
  res: Response,
  body: Record<string, unknown>
): number | undefined {
  const header = res.headers.get('Retry-After');
  if (header && !Number.isNaN(Number(header))) return Number(header);

  const message = typeof body?.message === 'string' ? body.message : '';
  const match = message.match(/(\d+)\s*s\b/i);
  return match ? Number(match[1]) : undefined;
}