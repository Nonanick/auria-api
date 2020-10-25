import { ApiError } from './ApiError';
import { ApiException } from './ApiException';

export type Maybe<T> = T | ApiError | ApiException;

export type MaybePromise<T> = Promise<Maybe<T>>;