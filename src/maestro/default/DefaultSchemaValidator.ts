import { ApiParameterSchemaPolicy } from "../../policies/ApiParameterSchemaPolicy";
import { Maybe } from "../../error/Maybe";
import { IApiRouteRequest } from "../../request/IApiRouteRequest";
import { IProxiedApiRoute } from "../../proxy/IProxiedApiRoute";
import { ApiException } from "../../error/ApiException";
import { UnknownParameterSchemaPolicy } from "../../error/exceptions/UnknowmParameterSchemaPolicy";
import { ApiError } from "../../error/ApiError";
import { ParameterSchemaViolation } from "../../error/error/ParameterSchemaViolation";
import { isRouteParameterSpecification } from "../../route/IRouteParameterSpecification";

const DefaultSchemaPolicy: ApiParameterSchemaPolicy = "enforce-required";

type ValidationPolicies = {
  "dont-validate": ParameterSchemaEnforcerFunction;
  "enforce-required": ParameterSchemaEnforcerFunction;
  "strict-schema": ParameterSchemaEnforcerFunction;
  [name: string]: ParameterSchemaEnforcerFunction;
}
/**
 * Schema Policy Enforcers
 * -----------------------
 * Hold all known Schema Policy Enforcers
 *
 */
const SchemaValidationsPolicies: ValidationPolicies = {
  "dont-validate": DontValidatePolicy,
  "enforce-required": EnforceRequiredPolicy,
  "strict-schema": OnlyInSchemaPolicy,
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
export function DefaultSchemaValidator(
  request: IApiRouteRequest,
  route: IProxiedApiRoute
): Maybe<true> {
  let policy = route.parameterSchemaPolicy ?? DefaultSchemaPolicy;

  if (typeof SchemaValidationsPolicies[policy] === "function") {
    try {
      let ans = SchemaValidationsPolicies[policy](request, route);
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

  return new UnknownParameterSchemaPolicy(
    "Route requires an unkown schema policy!"
  );
}

export function SetSchemaPolicyValidation(
  policyName: string,
  enforcer: ParameterSchemaEnforcerFunction
): void {
  SchemaValidationsPolicies[policyName] = enforcer;
}

function DontValidatePolicy(
  request: IApiRouteRequest,
  route: IProxiedApiRoute
): Maybe<true> {
  return true;
}

function EnforceRequiredPolicy(
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

function OnlyInSchemaPolicy(
  request: IApiRouteRequest,
  route: IProxiedApiRoute
): Maybe<true> {

  let knownRequiredParameters : string[] = [];
  let knownOptionalParameters : string[] = [];

  let allKnownParameters : string[] = [];

  let allParameters = request.parametersByOrigin ?? {};

  for (let origin in allParameters) {
    for (let param in allParameters[origin]) {
      let ans = parameterExistsInRouteSchema(route, origin, param);
      if (ans != true) {
        return new ParameterSchemaViolation('Route only allow known parameters!')
      }
    }
  }

  return true;
}

function parameterExistsInRouteSchema(route: IProxiedApiRoute, origin: string, param: string): Maybe<true> {
  
  // Search in required parameters


  return true;

}

export type ParameterSchemaEnforcerFunction = (
  request: IApiRouteRequest,
  route: IProxiedApiRoute
) => Maybe<true>;
