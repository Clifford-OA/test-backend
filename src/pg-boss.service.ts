import { DiscoveryService } from '@golevelup/nestjs-discovery';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PgBoss from 'pg-boss';
import { PGBOSS_JOB } from './decorators/pg-boss-job.decorator';

@Injectable()
export class PgBossService implements OnModuleInit, OnModuleDestroy {
  private readonly pgBoss: PgBoss;
  private readonly logger = new Logger(PgBossService.name);

  constructor(
    private readonly discoveryService: DiscoveryService,
    configService: ConfigService,
  ) {
    this.pgBoss = new PgBoss({
      connectionString: configService.getOrThrow<string>('DATABASE_URL'),
      maintenanceIntervalMinutes: 1,
      pollingIntervalSeconds: 60,
      archiveCompletedAfterSeconds: 60,
      archiveFailedAfterSeconds: 60 * 60 * 24,
      deleteAfterHours: 1,
      retryLimit: 2,
      retryBackoff: true,
      retryDelay: 60,
    });
  }

  async onModuleInit() {
    await this.pgBoss.start();
    this.logger.log('PgBoss started successfully.');

    const discovered =
      await this.discoveryService.providerMethodsWithMetaAtKey<string>(
        PGBOSS_JOB,
      );

    for (const { meta: queueName, discoveredMethod } of discovered) {
      const { handler, parentClass } = discoveredMethod;

      await this.pgBoss.createQueue(queueName);

      this.logger.log(`Registering job handler for queue: ${queueName}`);

      await this.pgBoss.work(queueName, async (jobs) => {
        await Promise.all(
          jobs.map(async (job) => {
            console.log(`Processing job for queue: ${queueName}`);
            await handler.call(parentClass.instance, job);
          }),
        );
      });
    }
  }

  async onModuleDestroy() {
    await this.pgBoss.stop();
  }

  async send(queueName: string, data: any) {
    this.logger.log(`Sending job to queue: ${queueName}`);
    await this.pgBoss.send(queueName, data);
    this.pgBoss.notifyWorker(queueName);
  }
}
