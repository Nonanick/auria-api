import { IRouteRequest } from '../../request/route_request.type';
import { HandlerInjectorSymbol } from '../injectable_handler.type'
import { IRoute } from '../route.type';

export function Request() {
  return function (proto: any, property: string, index: number) {

    // Initialize object, if empty
    if (proto[HandlerInjectorSymbol] == null) {
      proto[HandlerInjectorSymbol] = {
        [property]: []
      };
    }
    if(proto[HandlerInjectorSymbol][property] == null) {
      proto[HandlerInjectorSymbol][property] = [];
    }

    proto[HandlerInjectorSymbol][property][index] = (_route : IRoute, req : IRouteRequest) => {
      return req;
    }
  }
}