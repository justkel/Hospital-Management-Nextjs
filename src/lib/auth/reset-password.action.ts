'use server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

type ResetPasswordData = {
  resetPassword?: boolean;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function resetPasswordAction(input: {
  token: string;
  newPassword: string;
}) {
  let json: GraphQLResponse<ResetPasswordData>;

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation ResetPassword($input: ResetPasswordInput!) {
            resetPassword(input: $input)
          }
        `,
        variables: { input },
      }),
    });

    json = (await res.json()) as GraphQLResponse<ResetPasswordData>;
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
      message: err.message || 'Failed to reset password',
    };
  }

  if (!json.data?.resetPassword) {
    return {
      success: false,
      message: 'Failed to reset password',
    };
  }

  return { success: true };
}