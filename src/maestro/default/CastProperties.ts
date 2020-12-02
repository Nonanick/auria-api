import { MaybePromise } from 'error/Maybe';
import { IProxiedRoute } from 'proxy/IProxiedRoute';
import { IRouteRequest } from 'request/IRouteRequest';

export async function CastProperties(
  route: IProxiedRoute,
  request: IRouteRequest
): MaybePromise<true> {

  if (route.cast != null) {
    request = await route.cast(request);
  }

  return true;
}