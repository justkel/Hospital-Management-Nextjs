'use server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

type ValidateTokenData = {
  validatePasswordResetToken?: boolean;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function validatePasswordResetTokenAction(
  token: string,
): Promise<boolean> {
  if (!token) return false;

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query ValidatePasswordResetToken($token: String!) {
            validatePasswordResetToken(token: $token)
          }
        `,
        variables: { token },
      }),
    });

    const json = (await res.json()) as GraphQLResponse<ValidateTokenData>;

    if (json.errors?.length) return false;

    return json.data?.validatePasswordResetToken ?? false;
  } catch {
    return false;
  }
}