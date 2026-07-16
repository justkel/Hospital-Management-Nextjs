'use server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

type RequestPasswordResetData = {
  requestPasswordReset?: boolean;
};

type GraphQLErrorResponse = {
  message: string;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLErrorResponse[];
};

export async function requestPasswordResetAction(input: { email: string }) {
  let json: GraphQLResponse<RequestPasswordResetData>;

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
            requestPasswordReset(input: $input)
          }
        `,
        variables: { input },
      }),
    });

    json = (await res.json()) as GraphQLResponse<RequestPasswordResetData>;
  } catch {
    return {
      success: false,
      message: 'Unable to reach the server. Please try again.',
    };
  }

  if (json.errors?.length) {
    const err = json.errors[0];

    return {
      success: false,
      message: err.message || 'Something went wrong. Please try again.',
    };
  }

  return { success: true };
}