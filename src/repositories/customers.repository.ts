import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CustomersDataSource} from '../datasources';
import {Customers} from '../models';

export class CustomersRepository extends DefaultCrudRepository<
  Customers,
  typeof Customers.prototype.id
> {
  constructor(
    @inject('datasources.customers') dataSource: CustomersDataSource,
  ) {
    super(Customers, dataSource);
  }
}
