import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RolesDataSource} from '../datasources';
import {Roles, RolesRelations} from '../models';

export class RolesRepository extends DefaultCrudRepository<
  Roles,
  typeof Roles.prototype.id,
  RolesRelations
> {
  constructor(
    @inject('datasources.roles') dataSource: RolesDataSource,
  ) {
    super(Roles, dataSource);
  }
}
