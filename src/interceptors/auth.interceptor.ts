import {Interceptor} from '@loopback/core';
import {RestBindings} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import {logger} from '../utils';

export const authInterceptor: Interceptor = async (invocationCtx, next) => {
  const httpReq = await invocationCtx.get(RestBindings.Http.REQUEST, {
    optional: true,
  });

  const bearerToken = httpReq?.headers['authorization'];

  if (!bearerToken) {
    throw new Error(`No token found in headers`);
  }

  const token = bearerToken.split(' ')[1];
  console.log({token});

  const privateKey: string = process.env.SECRET_KEY || 'dweiooewpasopew';

  jwt.verify(token, privateKey, function (err, decoded) {
    if (err) {
      throw new Error(`Invalid Token`);
    }
    logger.info('Decoded token', {decoded});
  });

  const result = await next();
  return result;
};
