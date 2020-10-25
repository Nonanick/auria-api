import { SchemaEnforcedPolicyNotImplemented } from '../../error/exceptions/SchemaEnforcedPolicyNotImplemented';
import { SchemaEnforcerPolicyVault } from '../../policies/SchemaEnforcerPolicyVault';
import { RouteSchemaEnforcer } from '../../validation/policies/schema/RouteSchemaEnforcer';

export const DefaultSchemaEnforcedPolicy = 'strict';

export const SchemaEnforcer: RouteSchemaEnforcer = (route, request) => {

  let enforcedPolicy = SchemaEnforcerPolicyVault[route.enforceSchemaPolicy ?? DefaultSchemaEnforcedPolicy];
  if (typeof enforcedPolicy !== 'function') {
    return new SchemaEnforcedPolicyNotImplemented(
      'Requested schema policy ',
      route.enforceSchemaPolicy!,
      ' was not injected into SchemaEnforcerPolicyVault'
    );
  }

  return true;

}; 