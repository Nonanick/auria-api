import { Maybe, MaybePromise } from "../../error/Maybe";
import { IRouteRequest } from '../../request/IRouteRequest';

export interface BaseSchema<T = any> {
  type: string;
  cast?: (value: any) => T;
  validate?: (value: any, request: IRouteRequest) => Maybe<true> | MaybePromise<true>;
}