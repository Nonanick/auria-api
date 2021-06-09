import { MaybePromise } from '../../error/maybe.type';

export type ParameterTransformation<In = any, Out = any> = (value : In) => MaybePromise<Out>;