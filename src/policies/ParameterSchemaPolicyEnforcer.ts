import { ApiParameterSchemaPolicy } from "./ApiParameterSchemaPolicy";
import { Maybe } from "../error/Maybe";
import { IApiRouteRequest } from "../request/IApiRouteRequest";
import { IProxiedApiRoute } from "../proxy/IProxiedApiRoute";
import { ApiException } from "../error/ApiException";
import { UnkownParameterSchemaPolicy } from "../error/exceptions/UnknowmParameterSchemaPolicy";
import { ApiError } from "../error/ApiError";
import { assert } from "console";
import { ParameterSchemaViolation } from "../error/error/ParameterSchemaViolation";
import { isRouteParameterSpecification } from "../route/IRouteParameterSpecification";
import { RouteParameter } from '../route/RouteParameter';

const DefaultSchemaPolicy: ApiParameterSchemaPolicy = "enforce-required";

/**
 * Schema Policy Enforcers
 * -----------------------
 * Hold all known Schema Policy Enforcers
 *
 */
const SchemaPolicyEnforcers: {
  [name: string]: ParameterSchemaEnforcerFunction;
} = {
  none: noSchemaPolicy,
  "enforce-required": enforceRequired,
  "only-in-schema": onlyInSchema,
};

/**
 * Apply Parameter Schema Policy
 * ------------------------------
 * Applies the desired schema policy on the request
 *
 * @param request
 * @param route
 * @param policy
 */
export function applyParameterSchemaPolicy(
  request: IApiRouteRequest,
  route: IProxiedApiRoute
): Maybe<true> {
  let policy = route.parameterSchemaPolicy ?? DefaultSchemaPolicy;

  if (typeof SchemaPolicyEnforcers[policy] === "function") {
    try {
      let ans = SchemaPolicyEnforcers[policy](request, route);
      if (
        typeof ans === "boolean" ||
        ans instanceof ApiError ||
        ans instanceof ApiException
      ) {
        return ans;
      }
    } catch (err) {
      if (err instanceof ApiError || err instanceof ApiException) {
        return err;
      }

      throw err;
    }
  }

  return new UnkownParameterSchemaPolicy(
    "Route requires an unkown schema policy!"
  );
}

export function setParameterSchemaEnforcer(
  policyName: string,
  enforcer: ParameterSchemaEnforcerFunction
): void {
  SchemaPolicyEnforcers[policyName] = enforcer;
}

function noSchemaPolicy(
  request: IApiRouteRequest,
  route: IProxiedApiRoute
): Maybe<true> {
  return true;
}

function enforceRequired(
  request: IApiRouteRequest,
  route: IProxiedApiRoute
): Maybe<true> {
  let required = route.requiredParameters;

  if (required === undefined) return true;

  // Apply to each required parameters
  if (Array.isArray(required)) {
    for (let requiredParam of required) {
      if (typeof requiredParam === "string") {
        if (!request.hasParameter(requiredParam)) {
         return new ParameterSchemaViolation(`Route requires parameter ${required} to be present!`);
        }
      }
      if (isRouteParameterSpecification(requiredParam)) {
        if (!request.hasParameter(requiredParam.name, requiredParam.origin)) {
          return new ParameterSchemaViolation(`Route requires parameter ${required} to be present!`);
        }
      }
    }
    return true;
  }

  if (typeof required === "string") {
   return searchInRequest(request, required);
  }

  if (isRouteParameterSpecification(required)) {
   return searchInRequest(request, required.name, required.origin);
  }

  // Wierd --
  console.warn(
    'Required parameters "',
    required,
    '" is in a wierd format, could not enforce it!'
  );
  return true;
}

function searchInRequest(
  request: IApiRouteRequest,
  param: string,
  origin?: string
): Maybe<true> {
  if (!request.hasParameter(param, origin)) {
    return new ParameterSchemaViolation(
      `Route requires parameter ${param} to be present!`
    );
  } else {
    return true;
  }
}

function onlyInSchema(
  request: IApiRouteRequest,
  route: IProxiedApiRoute
): Maybe<true> {

  let allParameters = request.parametersByOrigin ?? {};

  for(let origin in allParameters) {
    for(let param in allParameters[origin]) {
      let ans = parameterExistsInRoute(route, origin, param);
      if(ans != true) {
        return new ParameterSchemaViolation('Route only allow known parameters!')
      }
    }
  }

  return true;
}

function parameterExistsInRoute(route : IProxiedApiRoute, origin : string, param : string) : Maybe<true> {
  // TODO implement me!
  if(Array.isArray(param)) {

  }

  return true;

}

export type ParameterSchemaEnforcerFunction = (
  request: IApiRouteRequest,
  route: IProxiedApiRoute
) => Maybe<true>;
