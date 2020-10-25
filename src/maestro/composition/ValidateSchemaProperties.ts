import { MaybePromise } from '../../error/Maybe';
import { IProxiedApiRoute } from '../../proxy/IProxiedApiRoute';
import { IApiRouteRequest } from '../../request/IApiRouteRequest';

export type ValidateSchemaProperties = (
  route: IProxiedApiRoute,
  request: IApiRouteRequest
) => MaybePromise<true>;