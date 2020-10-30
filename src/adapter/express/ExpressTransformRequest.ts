import { Request } from 'express';
import { IApiRouteRequest } from '../../request/IApiRouteRequest';
import { ApiRouteRequest } from '../../request/ApiRouteRequest';
import { ExpressAdapter } from './ExpressAdapter';
import { ExpressHeaderOrigin, ExpressCookieOrigin, ExpressBodyOrigin, ExpressQueryStringOrigin, ExpressUrlOrigin } from './ExpressParameterOrigins';

export function ExpressTransformRequest(request: Request): IApiRouteRequest {

  let req: IApiRouteRequest = new ApiRouteRequest(ExpressAdapter.ADAPTER_NAME, request.originalUrl);

  //  Request Identification in Express is List of IP's + User Agent
  let requestIdentification = request.ips.join(' - ')
    + " | "
    + request.headers["user-agent"] ?? "UA-NOT-PROVIDED";
  req.identification = requestIdentification;

  // Add Header parameters
  for (let headerName in request.headers) {
    req.add(headerName, request.headers[headerName], ExpressHeaderOrigin);
  }

  // Add Cookie parameters
  for (let cookieName in request.cookies) {
    req.add(cookieName, request.cookies[cookieName], ExpressCookieOrigin);
  }

  // Add Body parameters
  for (let bodyName in request.body) {
    req.add(bodyName, request.body[bodyName], ExpressBodyOrigin);
  }

  // Add QueryString parameters
  for (let qsName in request.query) {
    req.add(qsName, request.query[qsName], ExpressQueryStringOrigin);
  }

  // Add URL parameters
  for (let urlName in request.params) {
    req.add(urlName, request.params[urlName], ExpressUrlOrigin);
  }

  return req;
}
