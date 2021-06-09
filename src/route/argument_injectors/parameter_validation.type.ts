import { Maybe, MaybePromise } from '../../error/maybe.type';

export type ParameterValidation<T = any> = (parameter : T) => Maybe<true> | MaybePromise<true>;