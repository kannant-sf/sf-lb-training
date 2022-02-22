import {MiddlewareSequence, RequestContext} from '@loopback/rest';

export interface SequenceHandler {
  handle(context: RequestContext): Promise<void>;
}
export class MySequence extends MiddlewareSequence {
  async handle(context: RequestContext): Promise<void> {
    // console.log('Before request', {
    //   requestedBaseUrl: context.requestedBaseUrl,
    //   basePath: context.basePath,
    // });

    // if (allowOrigin !== referer) {
    //   console.log('Inside', {allowOrigin, referer});
    //   throw new Error(`You referer is not allowed to go inside`);
    // }

    await super.handle(context);
  }
}
