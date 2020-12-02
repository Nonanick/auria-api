import { MaybePromise } from '../../error/Maybe';
import { IProxiedRoute } from '../../proxy/IProxiedRoute';
import { IRouteRequest } from '../../request/IRouteRequest';
import { SchemaValidator } from './SchemaValidator';

export async function SchemaEnforcer(
  route: IProxiedRoute,
  request: IRouteRequest
): MaybePromise<true> {

  if (route.schema != null) {

    let allValid: Promise<boolean>[] = [];

    for (let origin in route.schema) {

      let originSchema = route.schema[origin]!;
      let originParams = request.byOrigin?.[origin];

      if (originSchema != null && originParams != null) {
        allValid.push(SchemaValidator.validate(originSchema, originParams) as Promise<boolean>);
      }

    }

    let isValid = (await Promise.all(allValid))
      .filter(v => v !== true).length === 0
      ? true
      : new Error(SchemaValidator.errorsText());

    return isValid;
  }

  return true;
}