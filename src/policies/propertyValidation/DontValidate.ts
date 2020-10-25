import { FailedSchemaValidationPolicyFunction } from '../../validation/policies/property/FailedSchemaValidationPolicy';

export const DontValidate: FailedSchemaValidationPolicyFunction =
  (route, request) => {
    return true;
  };