import { ApiError } from '../../error/api_error.error';
import { MaybePromise } from '../../error/maybe.type';
import { SchemaViolation } from '../../error/schema/schema_violation.error';
import { IProxiedRoute } from '../../proxy/proxied_route.type';
import { IRouteRequest } from '../../request/route_request.type';
import { RouteSchema } from '../route_schema.type';
import { SchemaValidator } from './schema_validator.const';

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
      }).catch(err => {
        console.error("[Maestro - Schema Enforcer] Failed to validate request -> Promise exception!\n",err);
        return Error(SchemaValidator.errorsText());
      });

  }

  return true;
}