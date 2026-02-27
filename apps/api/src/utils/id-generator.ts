import { randomUUID } from "node:crypto";

export class IdGenerator {
  static readonly PrefixLength = 3;
  static readonly Separator = "-";

  private readonly prefix: string;
  private readonly idPattern: RegExp;

  constructor(prefix: string) {
    if (prefix !== prefix.toLowerCase()) {
      throw new Error(`prefix[${prefix}] must be in lower case`);
    }

    if (prefix.trim() !== prefix) {
      throw new Error(`prefix[${prefix}] must be trimmed`);
    }

    if (prefix.length !== IdGenerator.PrefixLength) {
      throw new Error(`prefix[${prefix}] must be ${IdGenerator.PrefixLength} characters long`);
    }

    this.prefix = prefix;
    this.idPattern = new RegExp(`^${prefix}\\${IdGenerator.Separator}[0-9a-f]{32}$`);
  }

  randomId(): string {
    const uuid = randomUUID();
    return this.fromUuid(uuid);
  }

  validate(id: string): boolean {
    return this.idPattern.test(id);
  }

  private fromUuid(uuid: string): string {
    return `${this.prefix}${IdGenerator.Separator}${uuid.replace(/-/g, "")}`;
  }
}
