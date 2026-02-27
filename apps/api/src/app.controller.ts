import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from '@/modules/auth/application/decorators/public.decorator';

@ApiTags('app')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('healthz')
  getHealthz(): { status: string } {
    return this.appService.getHealthz();
  }
}
