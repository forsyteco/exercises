/**
 * Command for the login use case.
 * expiry: optional expiration timespan in rauchg/ms format (e.g. "60s", "10h").
 */
export class LoginCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly expiry?: string,
  ) {}
}
