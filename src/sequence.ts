import {MiddlewareSequence, RequestContext} from '@loopback/rest';

export interface SequenceHandler {
  handle(context: RequestContext): Promise<void>;
}
export class MySequence extends MiddlewareSequence {
  async handle(context: RequestContext): Promise<void> {
    const {request} = context;
    const now = new Date();
    const allowOrigin = process.env.ALLOWED_ORIGIN;
    const referer = request.headers['referer'];
    console.log({env: process.env.ALLOWED_ORIGIN});
    console.log('Before request', {
      requestedBaseUrl: context.requestedBaseUrl,
      basePath: context.basePath,
      baseUrl: request.baseUrl,
      userAgent: request.headers['user-agent'],
      referer: request.headers['referer'],
      origin: request.headers['origin'],
      host: request.headers['host'],
      startTime: now,
    });

    if (allowOrigin !== referer) {
      console.log('Inside', {allowOrigin, referer});
      throw new Error(`You referer is not allowed to go inside`);
    }

    await super.handle(context);
    console.log('After request', {endTime: new Date()});
  }
}
