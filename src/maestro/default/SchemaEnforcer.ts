import { MaybePromise } from '../../error/Maybe';
import { IProxiedRoute } from '../../proxy/IProxiedRoute';
import { IRouteRequest } from '../../request/IRouteRequest';

export async function SchemaEnforcer(
  route: IProxiedRoute,
  request: IRouteRequest
): MaybePromise<true> {

  if (route.compiledSchema != null) {
    let isValid = await route.compiledSchema(request);
    return isValid;
  }

  return true;
}