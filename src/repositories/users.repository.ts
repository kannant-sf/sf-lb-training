import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {SoftCrudRepository} from 'loopback4-soft-delete';
import {UsersDataSource} from '../datasources';
import {Customers, Roles, Users, UsersRelations} from '../models';
import {CustomersRepository} from './customers.repository';
import {RolesRepository} from './roles.repository';

export class UsersRepository extends SoftCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
> {
  public readonly customers: BelongsToAccessor<
    Customers,
    typeof Users.prototype.id
  >;

  public readonly roles: BelongsToAccessor<Roles, typeof Users.prototype.id>;

  constructor(
    @inject('datasources.users') dataSource: UsersDataSource,
    @repository.getter('CustomersRepository')
    protected customersRepositoryGetter: Getter<CustomersRepository>,
    @repository.getter('RolesRepository')
    protected rolesRepositoryGetter: Getter<RolesRepository>,
  ) {
    super(Users, dataSource);
    this.roles = this.createBelongsToAccessorFor(
      'roles',
      rolesRepositoryGetter,
    );
    this.registerInclusionResolver('roles', this.roles.inclusionResolver);
    this.customers = this.createBelongsToAccessorFor(
      'customers',
      customersRepositoryGetter,
    );
    this.registerInclusionResolver(
      'customers',
      this.customers.inclusionResolver,
    );
  }
}
