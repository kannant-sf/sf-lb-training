import {belongsTo, Entity, model, property} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';
import {Permissions} from 'loopback4-authorization';
import {Customers} from './customers.model';
import {Roles} from './roles.model';

@model({settings: {strict: false}})
export class Users extends Entity implements IAuthUser, Permissions<string> {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  fName: string;

  @property({
    type: 'string',
  })
  mName?: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
    required: true,
  })
  lName: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  permissions: string[];

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  no: string;

  @belongsTo(() => Customers)
  customersId: number;

  @belongsTo(() => Roles)
  rolesId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
