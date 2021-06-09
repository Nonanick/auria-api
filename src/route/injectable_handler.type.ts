import { IProxiedRoute } from '../proxy/proxied_route.type';
import type { IRouteRequest } from '../request/route_request.type';

export const HandlerInjectorSymbol = Symbol('HandlerInjectors');

export type ArgumentInjector<T = any> = (route : IProxiedRoute, req : IRouteRequest) => T | Promise<T>;

export interface InjectableHandler extends CallableFunction {
  [HandlerInjectorSymbol] : ArgumentInjector[];
}

export function isInjectableHandler(obj : any) : obj is InjectableHandler {
  return (
    typeof obj === 'function'
    && typeof obj[HandlerInjectorSymbol] === 'object'
    && Array.isArray(obj[HandlerInjectorSymbol])
    && obj[HandlerInjectorSymbol].length > 0
  );
}