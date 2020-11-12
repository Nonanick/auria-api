import { IRouteRequest } from '../request/IRouteRequest';
import { Maybe, MaybePromise } from '../error/Maybe';

/**
 * Api Request Proxy
 * ------------------
 * Adds the possibility
 */
export interface IProxyRequest {

  readonly name: string;
  apply(request: IRouteRequest): Maybe<IRouteRequest> | MaybePromise<IRouteRequest>;

}

export function implementsRequestProxy(obj: any): obj is IProxyRequest {
  return (
    typeof obj.name === "string"
    && typeof obj.apply === 'function'
  );
}