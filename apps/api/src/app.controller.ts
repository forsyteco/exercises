import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthz')
  getHealthz(): { status: string } {
    return this.appService.getHealthz();
  }
}
