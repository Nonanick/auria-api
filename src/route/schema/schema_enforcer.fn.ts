import type { IProxiedRoute } from '../../proxy/proxied_route.type';
import type { IRouteRequest } from '../../request/route_request.type';
import type { MaybePromise } from '../../error/maybe.type';
import type { RouteSchema } from '../route_schema.type';
import { SchemaViolation } from '../../error/schema/schema_violation.error';
import { SchemaValidator } from './schema_validator.const';
import { Log } from '../../logger/logger.class';

export async function SchemaEnforcer(
  route: IProxiedRoute,
  request: IRouteRequest
): MaybePromise<true> {

  if (route.schema != null) {

    let allValid: Promise<boolean>[] = [];

    for (let origin in route.schema) {

      let originSchema = route.schema[origin as keyof RouteSchema]!;
      let originParams = request.byOrigin?.[origin];

      if (originSchema != null && originParams != null) {
        allValid.push(SchemaValidator.validate<boolean>({$async : true, ...originSchema}, originParams) as Promise<boolean>);
      }

    }

    return Promise.all(allValid)
      .then(ok => {
        if (ok.includes(false)) {
          return new SchemaViolation(SchemaValidator.errors ?? []);
        }
        return true as true;
      })
      .catch(err => {
        Log.error(err, "[Maestro - Schema Enforcer] Failed to validate request -> Promise exception!\n");
        return new SchemaViolation(err.errors);
      });
  }

  return true;
}