import type { IRouteRequest } from '../request/IRouteRequest';
import type { IRoute } from './IRoute';

export const HandlerInjectorSymbol = Symbol('HandlerInjectors');

export type ArgumentInjector<T = any> = (route : IRoute, req : IRouteRequest) => T | Promise<T>;

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