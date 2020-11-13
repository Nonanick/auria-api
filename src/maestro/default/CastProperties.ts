import { MaybePromise } from 'error/Maybe';
import { IProxiedRoute } from 'proxy/IProxiedRoute';
import { IRouteRequest } from 'request/IRouteRequest';

export async function CastProperties(
  route: IProxiedRoute,
  request: IRouteRequest
): MaybePromise<true> {

  console.log('Will now cast properties from request!');
  // Iterate through each origin
  for (let origin in request.byOrigin) {
    const allParams = request.byOrigin[origin];
    const originSchema = route.schema?.[origin];

    // set cast
    for (let name in allParams) {
      const value = allParams[name];
      // Is there an schema definition for it?
      if (route.schema?.[origin]?.properties[name] != null) {
        const propertySchema = route.schema?.[origin]?.properties[name]!;

        if (typeof propertySchema.cast === "function") {
          console.log('Casting request property:', name, '!');
          let castedValue = await propertySchema.cast(value);
          console.log('Casted "', value, '" into "', castedValue, '"!');
          request.add(name, castedValue, origin);
        }
      }
    }

    // setOrigin cast
    if (originSchema?.cast != null) {
      let castedOrigin = await originSchema.cast(allParams);
      if (
        !(castedOrigin instanceof Error)
        && castedOrigin != null
      ) {
        request.setOrigin(origin, castedOrigin);
      } else {
        console.warn('Origin casting failed!', castedOrigin);
      }
    }

  }

  return true;
}