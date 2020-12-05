import { ApiError } from '../../error/ApiError';
import { MaybePromise } from '../../error/Maybe';
import { SchemaViolation } from '../../error/schema/SchemaViolation';
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

    return Promise.all(allValid)
      .then(ok => {
        if (ok.includes(false)) {
          return new SchemaViolation(SchemaValidator.errors ?? []);
        }
        return true as true;
      }).catch(err => {
        return Error(SchemaValidator.errorsText());
      });

  }

  return true;
}