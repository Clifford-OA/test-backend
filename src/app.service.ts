import { Injectable } from '@nestjs/common';
import { PgBossJob } from './decorators/pg-boss-job.decorator';
import { PgBossService } from './pg-boss.service';

@Injectable()
export class AppService {
  constructor(private readonly pgBossService: PgBossService) {}

  async getHello() {
    await this.pgBossService.send('send-email', {
      email: 'cliffordosei222@gmail.com',
      subject: 'This is a test subject',
      content: 'nothing',
    });
  }

  @PgBossJob('send-email')
  async handleSendEmail(job: any) {
    const { email, subject, content } = job.data;
    console.log(`Sending email to ${email} with subject: ${subject}`);
  }
}
