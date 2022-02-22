import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, Context} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {InvokeMiddlewareOptions, RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import winston from 'winston';
import {logMiddleware} from './middlewares';
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

    // Set up the custom sequence
    const middlewareOptions: InvokeMiddlewareOptions = {
      chain: 'middlewareChain.rest',
      orderedGroups: [
        // Please note that middleware is cascading. The `sendResponse` is
        // added first to invoke downstream middleware to get the result or
        // catch errors so that it can produce the http response.

        'sendResponse',

        // default
        'cors',
        'apiSpec',

        // default
        'middleware',

        // rest
        'findRoute',

        // authentication
        'authentication',

        // rest
        'parseParams',
        'invokeMethod',
      ],
    };
    // this.configure(RestBindings.SEQUENCE).to(middlewareOptions);
    this.sequence(MySequence);
    console.log('After sequence');
    this.middleware(logMiddleware);
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
