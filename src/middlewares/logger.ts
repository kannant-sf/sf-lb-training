import {Middleware} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import {logger} from '../utils';

export const logMiddleware: Middleware = async (middlewareCtx, next) => {
  const {request} = middlewareCtx;

  logger.info('Before Request', {
    userAgent: request.headers['user-agent'],
    referer: request.headers['referer'],
    origin: request.headers['origin'],
    host: request.headers['host'],
    startTime: new Date().toTimeString(),
    ip: request.ip,
    body: request.body,
  });

  const cookie: string = request.headers['cookie'] || '';
  console.log({cookie});

  if (cookie) {
    const userId = cookie.split('=')[1];

    const privateKey = process.env.SECRET_KEY || '';

    const token = jwt.sign({userId}, privateKey);

    console.log({token});

    request.headers['authorization'] = `Bearer ${token}`;
  }

  try {
    const result = await next();
    logger.info('Response completion time: %s', new Date().toTimeString());
    return result;
  } catch (err) {
    logger.error({err});
    // Catch errors from downstream middleware
    logger.warn('Error time: %s', new Date().toTimeString());
    throw err;
  }
};
