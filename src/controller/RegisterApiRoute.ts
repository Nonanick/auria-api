import { IApiRoute } from '../route/IApiRoute';

export const apiRoutesSymbol = Symbol('ApiControllerRoutes');

export function RegisterApiRoute(params: Omit<Partial<IApiRoute>, 'resolver'>&{url : string}) {

  return (target: any, propertyKey: string | symbol) => {
    let proto = target.constructor.prototype;

    if (proto[apiRoutesSymbol] == null) {
      proto[apiRoutesSymbol] = [];
    }

    let defaultConfig = proto['defaultRouteConfig'] ?? {};

    proto[apiRoutesSymbol].push({
      ...defaultConfig,
      ...params,
      resolver:proto[propertyKey]
    });
  };

}