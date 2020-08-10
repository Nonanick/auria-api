import { Response, NextFunction } from 'express';
import { ApiError } from '../../error/ApiError';
import { ApiException } from '../../error/ApiException';

export function ExpressErrorHandler(response : Response, next : NextFunction, error : ApiError | ApiException | Error) {
  next(error);
}