import { RequestPipeFunction } from 'maestro/composition/RequestPipe';
import { IProxiedApiRoute } from 'proxy/IProxiedApiRoute';
import { IApiRouteRequest } from 'request/IApiRouteRequest';
import { SchemaEnforcedPolicyNotImplemented } from '../../error/exceptions/SchemaEnforcedPolicyNotImplemented';
import { SchemaEnforcerPolicyVault } from '../../policies/SchemaEnforcerPolicyVault';

export const DefaultSchemaEnforcedPolicy = 'strict';

export async function SchemaEnforcer(
  route: IProxiedApiRoute,
  request: IApiRouteRequest,
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