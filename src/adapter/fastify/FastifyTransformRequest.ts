import { FastifyRequest } from 'fastify';
import { IApiRouteRequest } from '../../request/IApiRouteRequest';
import { ApiRouteRequest } from '../../request/ApiRouteRequest';
import { FastifyAdapter } from './FastifyAdapter';
import { FastifyBodyOrigin, FastifyCookieOrigin, FastifyFileOrigin, FastifyHeaderOrigin, FastifyQueryStringOrigin, FastifyUrlOrigin } from './FastifyParameterOrigins';

export async function FastifyTransformRequest(request: FastifyRequest): Promise<IApiRouteRequest> {

  let req: IApiRouteRequest = new ApiRouteRequest(FastifyAdapter.ADAPTER_NAME, request.url);

  //  Request Identification in Express is List of IP's + User Agent
  let requestIdentification = (request.ips != null ? request.ips.join(' - ') : request.ip)
    + " | "
    + request.headers["user-agent"] ?? "UA-NOT-PROVIDED";
  req.identification = requestIdentification;

  let body = request.body as any ?? {};
  let query = request.query as any ?? {};
  let params = request.params as any ?? {};
  let files = await request.files();

  // Add Header parameters
  for (let headerName in request.headers) {
    req.add(
      headerName,
      request.headers[headerName],
      FastifyHeaderOrigin
    );
  }

  // Add Cookie parameters
  for (let cookieName in request.cookies) {
    req.add(
      cookieName,
      request.cookies[cookieName],
      FastifyCookieOrigin
    );
  }

  // Add Body parameters
  for (let bodyName in body) {
    req.add(
      bodyName,
      body[bodyName],
      FastifyBodyOrigin
    );
  }

  // Add QueryString parameters
  for (let qsName in query) {
    req.add(
      qsName,
      query[qsName],
      FastifyQueryStringOrigin
    );
  }

  // Add URL parameters
  for (let urlName in params) {
    req.add(
      urlName,
      params[urlName],
      FastifyUrlOrigin
    );
  }

  /*for await (let singleFile of files) {
    req.addParameter(
      singleFile.fieldname,
      singleFile,
      FastifyFileOrigin
    );
  }*/

  return req;
}
