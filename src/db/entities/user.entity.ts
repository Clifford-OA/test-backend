import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string;

  @Property({ unique: true })
  email: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;
}
