import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  triggerBackgroundJob() {
    return this.appService.getHello();
  }
}
