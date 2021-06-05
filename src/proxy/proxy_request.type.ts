import { IRouteRequest } from '../request/route_request.type';
import { Maybe, MaybePromise } from '../error/maybe.type';

/**
 * Api Request Proxy
 * ------------------
 * Adds the possibility
 */
export interface IProxyRequest {

  readonly name: string;
  apply(request: IRouteRequest): Maybe<IRouteRequest> | MaybePromise<IRouteRequest>;
  discoverable?: boolean;

}

export function implementsRequestProxy(obj: any): obj is IProxyRequest {
  return (
    typeof obj.name === "string"
    && typeof obj.apply === 'function'
  );
}