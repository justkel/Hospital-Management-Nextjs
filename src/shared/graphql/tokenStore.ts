let currentAccessToken: string | null = null;

export function setAccessToken(token: string) {
  currentAccessToken = token;
}

export function getAccessToken(): string | null {
  return currentAccessToken;
}
