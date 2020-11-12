import { RequestPipeFunction } from 'maestro/composition/RequestPipe';
import { IProxiedRoute } from 'proxy/IProxiedRoute';
import { IRouteRequest } from 'request/IRouteRequest';
import { SchemaEnforcedPolicyNotImplemented } from '../../error/exceptions/SchemaEnforcedPolicyNotImplemented';
import { SchemaEnforcerPolicyVault } from '../../policies/SchemaEnforcerPolicyVault';

export const DefaultSchemaEnforcedPolicy = 'strict';

export async function SchemaEnforcer(
  route: IProxiedRoute,
  request: IRouteRequest,
) {

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