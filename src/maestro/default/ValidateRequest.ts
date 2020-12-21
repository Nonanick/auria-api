import { IProxiedRoute } from "../../proxy/IProxiedRoute";
import { IRouteRequest } from "../../request/IRouteRequest";

export async function ValidateRequest(
  route: IProxiedRoute,
  request: IRouteRequest
): Promise<true | Error> {

  if (route.validate != null) {

    if (typeof route.validate === "function") {
      let fn = route.validate;

      route.validate = [{
        name: 'anonymous-validation',
        discoverable: false,
        validate: fn
      }];
    }

    if (!Array.isArray(route.validate)) {
      route.validate = [route.validate];
    }

    let isValid: true | Error | Error[] = true;
    for (let v of route.validate) {
      isValid = await v.validate(request.byOrigin ?? {});
      if (isValid !== true) {
        break;
      }
    }

    if (Array.isArray(isValid)) {
      isValid = new Error(isValid.map(e => e.message).join('; '));
    }

    return isValid;
  }

  return true;
}