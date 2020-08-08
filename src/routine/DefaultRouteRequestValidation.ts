import { IProxiedApiRoute } from "../proxy/IProxiedApiRoute";
import { IApiRouteRequest } from "../request/IApiRouteRequest";
import { Maybe } from "../error/Maybe";

export function DefaultRouteRequestValidation(
  route: IProxiedApiRoute,
  request: IApiRouteRequest
): Maybe<true | string> {

  switch (route.parameterSchemaPolicy) {
    case "none":
      break;

    case "enforce-required":
      break;

    case "only-in-schema":
      break;
  }

  return true;
}

const ParameterSchemaPolicyEnforcer = {
  
};