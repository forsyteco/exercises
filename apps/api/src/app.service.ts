import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthz(): { status: string } {
    return { status: 'ok' };
  }
}
