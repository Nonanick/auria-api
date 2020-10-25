import { SchemaEnforcedPolicyNotImplemented } from '../../error/exceptions/SchemaEnforcedPolicyNotImplemented';
import { SchemaEnforcerPolicyVault } from '../../policies/SchemaEnforcerPolicyVault copy';
import { EnforceRouteSchema } from '../composition/EnforceRouteSchema';

export const DefaultSchemaEnforcedPolicy = 'strict';

export const SchemaEnforcer: EnforceRouteSchema = async (route, request) => {

  let enforcedPolicy = SchemaEnforcerPolicyVault[route.enforceSchemaPolicy ?? DefaultSchemaEnforcedPolicy];

  if (typeof enforcedPolicy !== 'function') {
    return new SchemaEnforcedPolicyNotImplemented(
      'Requested schema policy ',
      route.enforceSchemaPolicy!,
      ' was not injected into SchemaEnforcerPolicyVault'
    );
  }

  let allowedSchema = await enforcedPolicy(route, request);

  return allowedSchema;

}; 