import {inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  Send,
  SequenceActions,
  SequenceHandler,
} from '@loopback/rest';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import {Users} from './models';

// export interface SequenceHandler {
//   handle(context: RequestContext): Promise<void>;
// }
// export class MySequence extends MiddlewareSequence {
//   async handle(context: RequestContext): Promise<void> {
//     // console.log('Before request', {
//     //   requestedBaseUrl: context.requestedBaseUrl,
//     //   basePath: context.basePath,
//     // });

//     // if (allowOrigin !== referer) {
//     //   console.log('Inside', {allowOrigin, referer});
//     //   throw new Error(`You referer is not allowed to go inside`);
//     // }

//     await super.handle(context);
//   }
// }

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<Users>,
    @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
    protected invokeMiddleware: InvokeMiddleware = () => false,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      const finished = await this.invokeMiddleware(context);

      if (finished) return;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];

      const dummy = await this.authenticateRequest(request);

      console.log({dummy});
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      console.error({err});
      this.reject(context, err);
    }
  }
}
