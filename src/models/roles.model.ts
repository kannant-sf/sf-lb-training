import {Entity, model, property} from '@loopback/repository';

enum Keys {
  ADMIN = 'admin',
  SUPERADMIN = 'SuperAdmin',
  SUBSCRIBER = 'Subscriber',
}

@model()
export class Roles extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(Keys),
    },
  })
  name: Keys;

  constructor(data?: Partial<Roles>) {
    super(data);
  }
}

export interface RolesRelations {
  // describe navigational properties here
}

export type RolesWithRelations = Roles & RolesRelations;
