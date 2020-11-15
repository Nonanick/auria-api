import { IncomingMessage, ServerResponse } from 'http';
import { IRouteRequest } from '../../../request/IRouteRequest';
import { RouteRequest } from '../../../request/RouteRequest';
import { NodeAdapter } from '../NodeAdapter';

export function TransformRequest(
  request: IncomingMessage,
  matchedPattern: string
): IRouteRequest {

  const req: IRouteRequest = new RouteRequest(
    NodeAdapter.name,
    request.url ?? '',
    matchedPattern
  );


  return req;
}