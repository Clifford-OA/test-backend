import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import entities from './entities';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL,
  entities,
  autoJoinRefsForFilters: false,
  debug: true,
});
