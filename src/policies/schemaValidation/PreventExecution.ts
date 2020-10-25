import { FailedSchemaValidationPolicyEnforcer } from '../../validation/policies/property/FailedSchemaValidationPolicy';

export const PreventExecution: FailedSchemaValidationPolicyEnforcer =
  (route, request) => {

    return true;
  };