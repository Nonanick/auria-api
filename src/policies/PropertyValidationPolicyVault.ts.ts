import { FailedSchemaValidationPolicyFunction } from '../validation/policies/property/FailedSchemaValidationPolicy';
import { DestroyProperty } from './propertyValidation/DestroyProperty';
import { DontValidate } from './propertyValidation/DontValidate';
import { PreventExecution } from './propertyValidation/PreventExecution';

export const PropertyValidationPolicyVault: {
  [policyName: string]: FailedSchemaValidationPolicyFunction;
} = {};

export function addPropertyValidationPolicy(
  name: string,
  policy: FailedSchemaValidationPolicyFunction
) {
  PropertyValidationPolicyVault[name] = policy;
}

addPropertyValidationPolicy(
  'prevent-execution',
  PreventExecution
);
addPropertyValidationPolicy(
  'destroy-property',
  DestroyProperty
);
addPropertyValidationPolicy(
  'no-op',
  DontValidate
);