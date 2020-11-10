import { RouteSchemaEnforcer } from '../validation/policies/schema/RouteSchemaEnforcer';
import { DontEnforceSchema } from './schemaEnforcer/DontEnforceSchema';
import { EnforceRequiredSchema } from './schemaEnforcer/EnforceRequiredSchema';
import { EnforceStrictSchema } from './schemaEnforcer/EnforceStrictSchema';

export const SchemaEnforcerPolicyVault: {
  [policyName: string]: RouteSchemaEnforcer;
} = {
  'strict': EnforceStrictSchema,
  'enforce-required': EnforceRequiredSchema,
  'dont-enforce': DontEnforceSchema,
};