import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Users,
  Customers,
} from '../models';
import {UsersRepository} from '../repositories';

export class UsersCustomersController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
  ) { }

  @get('/users/{id}/customers', {
    responses: {
      '200': {
        description: 'Customers belonging to Users',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Customers)},
          },
        },
      },
    },
  })
  async getCustomers(
    @param.path.number('id') id: typeof Users.prototype.id,
  ): Promise<Customers> {
    return this.usersRepository.customers(id);
  }
}
