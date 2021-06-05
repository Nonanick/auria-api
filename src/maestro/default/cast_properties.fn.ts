import { MaybePromise } from 'error/maybe.type';
import { IProxiedRoute } from 'proxy/proxied_route.type';
import { IRouteRequest } from 'request/route_request.type';

export async function CastProperties(
  route: IProxiedRoute,
  request: IRouteRequest
): MaybePromise<true> {

  if (route.cast != null) {
    request = await route.cast(request);
  }

  return true;
}