import {Entity, model, property} from '@loopback/repository';

@model()
export class Customers extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  website?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  constructor(data?: Partial<Customers>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customers & CustomerRelations;
