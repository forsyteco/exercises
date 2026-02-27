import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { PasswordHasherPort } from '@/modules/user/application/ports/password-hasher.port';

const SALT_ROUNDS = 12;

@Injectable()
export class BcryptPasswordHasher extends PasswordHasherPort {
  async hash(plainText: string): Promise<string> {
    return hash(plainText, SALT_ROUNDS);
  }

  async compare(plainText: string, storedHash: string): Promise<boolean> {
    return compare(plainText, storedHash);
  }
}
