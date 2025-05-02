import { SetMetadata } from '@nestjs/common';

export const PGBOSS_JOB = 'PGBOSS_JOB';

export const PgBossJob = (queueName: string): MethodDecorator =>
  SetMetadata(PGBOSS_JOB, queueName);
