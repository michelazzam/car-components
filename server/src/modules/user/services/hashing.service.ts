import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';

@Injectable()
export class HashingService {
  async hashPassword(password: string) {
    return hash(password);
  }

  comparePassword({
    hashedPassword,
    password,
  }: {
    hashedPassword: string;
    password: string;
  }) {
    return verify(hashedPassword, password);
  }
}
