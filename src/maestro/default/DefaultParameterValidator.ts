import { ValidateApiCallFunction } from '../../validation/ValidateApiCallFunction';
import { ApiParametersValidationPolicy } from '../../policies/ApiParametersValidationPolicy';
import { isRouteParameterSpecification, IRouteParameterSpecification } from '../../route/IRouteParameterSpecification';
import { IApiRouteRequest } from '../../request/IApiRouteRequest';
import { ParameterValidationFailed } from '../../error/error/ParameterValidationFailed';
import { UnknownParameterValidationPolicy } from '../../error/exceptions/UnknowmParameterValidationPolicy';

export const DefaultValidationPolicy = process.env.DEFAULT_PARAMETER_VALIDATION_POLICY ?? 'prevent-execution';

export const DefaultParameterValidator: ValidateApiCallFunction = async (route, request) => {
  let policy = route.parametersValidationPolicy ?? DefaultValidationPolicy;

  if (ParameterValidationPolicies[policy as ApiParametersValidationPolicy] != null) {
    let valid = await ParameterValidationPolicies[policy as ApiParametersValidationPolicy](route, request);
    return valid;
  } else {
    throw new UnknownParameterValidationPolicy('Route uses an unkown validation policy!' + route.parametersValidationPolicy);
  }
};

export const ParameterValidationPolicies = asParamaterValidation({

  'dont-validate': (route, request) => {
    return true;
  },

  "ignore-parameter": async (route, request) => {

    if (route.requiredParameters == null) {
      route.requiredParameters = [];
    }

    if (!Array.isArray(route.requiredParameters)) {
      route.requiredParameters = [route.requiredParameters];
    }

    for (let param of route.requiredParameters) {
      // Required Parameter is a specification?
      if (isRouteParameterSpecification(param)) {
        let isParamValid = await applyValidationFromSpecificationToRequest(param, request);
        if (isParamValid !== true) {
          console.warn(
            'Parameter ', param.name, ' failed to validate and will be ignored according to the defined policy!', isParamValid
          );
          request.removeParameter(param.name, param.origin);
        }
      }
    }

    if (route.optionalParameters == null) {
      route.optionalParameters = [];
    }

    if (!Array.isArray(route.optionalParameters)) {
      route.optionalParameters = [route.optionalParameters];
    }

    for (let param of route.optionalParameters) {
      // Required Parameter is a specification?
      if (isRouteParameterSpecification(param)) {
        let isParamValid = await applyValidationFromSpecificationToRequest(param, request);
        if (isParamValid !== true) {
          console.warn(
            'Parameter ', param.name, ' failed to validate and will be ignored according to the defined policy!', isParamValid
          );
          request.removeParameter(param.name, param.origin);
        }
      }
    }

    return true as true;
  },

  "prevent-execution": async (route, request) => {

    if (route.requiredParameters == null) {
      route.requiredParameters = [];
    }
    if (!Array.isArray(route.requiredParameters)) {
      route.requiredParameters = [route.requiredParameters];
    }

    for (let param of route.requiredParameters) {
      // Required Parameter is a specification?
      if (isRouteParameterSpecification(param)) {
        let isParamValid = await applyValidationFromSpecificationToRequest(param, request);
        if (isParamValid !== true) {
          console.warn(
            'Parameter ', param.name, ' failed to validate and will be halt the request flow', isParamValid
          );
          throw isParamValid;
        }
      }
    }

    if (route.optionalParameters == null) {
      route.optionalParameters = [];
    }

    if (!Array.isArray(route.optionalParameters)) {
      route.optionalParameters = [route.optionalParameters];
    }

    for (let param of route.optionalParameters) {
      // Required Parameter is a specification?
      if (isRouteParameterSpecification(param)) {
        let isParamValid = await applyValidationFromSpecificationToRequest(param, request);
        if (isParamValid !== true) {
          console.warn(
            'Parameter ', param.name, ' failed to validate and will be halt the request flow', isParamValid
          );
          throw isParamValid;
        }
      }
    }

    return true as true;
  }

});

async function applyValidationFromSpecificationToRequest(
  parameter: IRouteParameterSpecification,
  request: IApiRouteRequest
) {
  // Validate exists and request received this parameter?
  if (parameter.validate != null && request.hasParameter(parameter.name, parameter.origin)) {
    if (Array.isArray(parameter.validate)) {
      for (let validation of parameter.validate) {
        let isValid = await validation(request.getParameter(parameter.name, parameter.origin));
        if (isValid !== true) {
          return new ParameterValidationFailed(isValid);
        }
      }
      return true;
    } else {
      let isValid = await parameter.validate!(request.getParameter(parameter.name, parameter.origin));
      return (
        isValid === true ?
          true : new ParameterValidationFailed(isValid)
      );
    }
  }

  return true as true;
}

function asParamaterValidation<T extends {
  [policyName in ApiParametersValidationPolicy]: ValidateApiCallFunction;
}>(arg: T): T {
  return arg;
}