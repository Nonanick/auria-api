import { IApiRouteRequest } from '../request/IApiRouteRequest';
import { Maybe } from '../error/Maybe';

/**
 * Api Request Proxy
 * ------------------
 * Adds the possibility
 */
export interface IApiRequestProxy {

  readonly name: string;
  apply(request: IApiRouteRequest): Maybe<IApiRouteRequest>;

}

export function implementsApiRequestProxy(obj: any): obj is IApiRequestProxy {
  return (
    typeof obj.name === "string"
    && typeof obj.apply === 'function'
  );
}