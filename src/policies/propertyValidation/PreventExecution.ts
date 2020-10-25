import { PropertyValidationFailed } from '../../error/error/ParameterValidationFailed';
import { FailedSchemaValidationPolicyFunction } from '../../validation/policies/property/FailedSchemaValidationPolicy';

export const PreventExecution: FailedSchemaValidationPolicyFunction =
  (route, request, origin, property, error) => {
    return new PropertyValidationFailed(
      'The property "' + property + '" failed to pass validation!',
      error
    );
  };