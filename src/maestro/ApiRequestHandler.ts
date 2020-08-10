import { IApiRouteRequest } from '../request/IApiRouteRequest';
import { IProxiedApiRoute } from '../proxy/IProxiedApiRoute';
import { ApiSendResponseFunction } from './ApiSendResponseFunction';
import { ApiSendErrorFunction } from './ApiSendErrorFunction';

export type ApiRequestHandler = (
  route : IProxiedApiRoute,
  request: IApiRouteRequest,
  sendResponse: ApiSendResponseFunction,
  sendError : ApiSendErrorFunction
) => void;