import { IApiRoute } from '../route/IApiRoute';
import { HTTPMethod } from '../route/HTTPMethod';

export const apiRoutesSymbol = Symbol('ApiControllerRoutes');

/**
 * Register Api Route
 * -------------------
 * Add a class method/parameter as an ApiResolver
 * 
 * @param params 
 */
export function RegisterApiRoute(params: Omit<Partial<IApiRoute>, 'resolver'> & { url: string }) {

  return (target: any, propertyKey: string | symbol) => {
    let proto = target.constructor.prototype;

    if (proto[apiRoutesSymbol] == null) {
      proto[apiRoutesSymbol] = [];
    }

    // Prevent duplicated HTTP Methods
    if (Array.isArray(params.methods)) {
      let nonDupMethods: HTTPMethod[] = [];
      params.methods.forEach(m => nonDupMethods.includes(m) ? undefined : nonDupMethods.push(m));
      params.methods = nonDupMethods;
    }

    let defaultConfig = proto['defaultRouteConfig'] ?? {};

    proto[apiRoutesSymbol].push({
      ... {
        parameterSchemaPolicy : 'enforce-required',
        parametersValidationPolicy : 'ignore-parameter',
        requiredParameters : [],
        optionalParameters : [],
        methods : 'all'
      },
      ...defaultConfig,
      ...params,
      resolver: proto[propertyKey]
    });
  };

}