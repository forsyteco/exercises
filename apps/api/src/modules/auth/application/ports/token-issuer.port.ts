/**
 * Port for issuing access tokens.
 * Tokens expire after 24 hours.
 */
export abstract class TokenIssuerPort {
  abstract issue(payload: { sub: string }): Promise<string>;
}
