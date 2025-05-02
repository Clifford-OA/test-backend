import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import mikroOrmConfig from './db/mikro-orm.config';
import { PgBossService } from './pg-boss.service';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    DiscoveryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PgBossService],
})
export class AppModule {}
