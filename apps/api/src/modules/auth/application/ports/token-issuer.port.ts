/**
 * Port for issuing access tokens.
 * expiry: optional expiration in rauchg/ms format (e.g. "60s", "10h"); implementation may use default if not provided.
 */
export abstract class TokenIssuerPort {
  abstract issue(payload: { sub: string }, expiry?: string): Promise<string>;
}
