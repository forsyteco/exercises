/**
 * Port for one-way password hashing and verification.
 * Use for storing and checking user passwords.
 */
export abstract class PasswordHasherPort {
  /** Hash a plain-text password. Returns the hashed value to store. */
  abstract hash(plainText: string): Promise<string>;
  /** Return true if plainText matches the stored hash. */
  abstract compare(plainText: string, hash: string): Promise<boolean>;
}
