import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppLogger } from './app.logger';
import { AppService } from './app.service';

@ApiTags('App Controller')
@Controller()
export class AppController {
  private readonly logger = new AppLogger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): string {
    this.logger.log(`${this.getHealth.name} was called`);
    return this.appService.getHealth();
  }
}
