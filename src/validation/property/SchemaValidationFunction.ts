import { Maybe, MaybePromise } from '../../error/Maybe';

export type SchemaValidationFunction = (schema: any, value: any) => Maybe<true> | MaybePromise<true>;
