import { IProxiedRoute } from "../../proxy/IProxiedRoute";
import { IRouteRequest } from "../../request/IRouteRequest";

export async function ValidateRequest(
  route: IProxiedRoute,
  request: IRouteRequest
): Promise<true | Error> {

  if (route.validate != null) {
    let isValid = await route.validate(request);
    if (Array.isArray(isValid)) {
      isValid = new Error(isValid.map(e => e.message).join('; '));
    }
    return isValid;
  }

  return true;
}