import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'roles',
  connector: 'postgresql',
  url: '',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'JS14@123',
  database: 'lbtraining'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class RolesDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'roles';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.roles', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
