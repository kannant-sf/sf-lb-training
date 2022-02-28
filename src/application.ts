import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, Context} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestTags} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import path from 'path';
import winston from 'winston';
import {logMiddleware} from './middlewares';
import {BearerTokenVerifyProvider} from './providers/verifyAuth';
import {MySequence} from './sequence';
import {logger} from './utils';
require('dotenv').config();

export {ApplicationConfig};

export const nameCTX = new Context();

nameCTX.bind('name').to('Kannan');

export class Lb4TrainingApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    //
    if (process.env.NODE_ENV !== 'production') {
      logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      );
    }

    // this.configure(RestBindings.SEQUENCE).to(middlewareOptions);
    this.sequence(MySequence);
    this.middleware(logMiddleware, {
      chain: RestTags.ACTION_MIDDLEWARE_CHAIN,
    });
    // this.configure(RestBindings)
    this.bind('meetAt').to(7);
    // this.bodyParser(JsonBodyParser);
    // this.bind().toDynamicValue

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(AuthenticationComponent);
    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.component(AuthorizationComponent);
    // Customize authentication verify handlers
    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifyProvider,
    );

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
