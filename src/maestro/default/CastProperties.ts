import { MaybePromise } from 'error/Maybe';
import { IProxiedRoute } from 'proxy/IProxiedRoute';
import { IRouteRequest } from 'request/IRouteRequest';

export async function CastProperties(
  route: IProxiedRoute,
  request: IRouteRequest
): MaybePromise<true> {

  // Iterate through each origin
  for (let origin in request.byOrigin) {
    const allParams = request.byOrigin[origin];

    // And each parameter
    for (let name in allParams) {
      const value = allParams[name];
      // Is there an schema definition for it?
      if (route.schema?.[origin]?.properties[name] != null) {
        const propertySchema = route.schema?.[origin]?.properties[name]!;

        if (typeof propertySchema.cast === "function") {
          console.log('Casting request property:', name, '!');
          let castedValue = propertySchema.cast(value);
          console.log('Casted "', value, '" into "', castedValue, '"!');
        }

      }
    }
  }


  return true;
}