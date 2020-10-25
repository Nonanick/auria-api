import { PropertyValidationFailed } from '../../error/error/ParameterValidationFailed';
import { FailedSchemaValidationPolicyFunction } from '../../validation/policies/property/FailedSchemaValidationPolicy';

export const DestroyProperty: FailedSchemaValidationPolicyFunction =
  (route, request, origin, property, error) => {

    request.removeParameter(
      property,
      origin
    );

    if (
      route.schema?.[origin]?.required?.includes(property)
      && route.enforceSchemaPolicy !== 'dont-enforce'
    ) {
      return new PropertyValidationFailed(
        'The property "' + property + '" is required but failed to pass validation!',
        error
      );
    }

    return true;
  };