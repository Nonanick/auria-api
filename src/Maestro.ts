// Adapter
export { IApiAdapter } from './adapter/IApiAdapter';
// -- Express
export * as Express from './adapter/express';
// -- Fastify
export * as Fastify from './adapter/fastify';

// Command
export { IApiCommand } from './command/IApiCommand';

// Container
export { ApiContainer } from './container/ApiContainer';
export { IApiContainer } from './container/IApiContainer';

// Controller
export { ApiController } from './controller/ApiController';
export { ApiControllerDefaultRouteConfig } from './controller/ApiControllerDefaultRouteConfig';
export { IApiController } from './controller/IApiController';
export { Route, apiRoutesSymbol, RegisterApiRouteParams } from './controller/RegisterApiRoute';

// Error
export { ApiError } from './error/ApiError';
export { ApiErrorDescription } from './error/ApiErrorDescription';
export { ApiException } from './error/ApiException';
export { Maybe } from './error/Maybe';
// Error - Errors
export { SchemaViolation as ParameterSchemaViolation } from './error/error/SchemaViolation';
export { PropertyValidationFailed as ParameterValidationFailed } from './error/error/ParameterValidationFailed';
// Error - Exceptions
export { RequestFlowNotDefined } from './error/exceptions/RequestFlowNotDefined';
export { UnknownParameterSchemaPolicy } from './error/exceptions/UnknowmParameterSchemaPolicy';
export { UnknownParameterValidationPolicy } from './error/exceptions/UnknowmParameterValidationPolicy';

// Maestro
export { ApiMaestro } from './maestro/ApiMaestro';
export { RequestHandler as ApiRequestHandler } from './maestro/composition/RequestHandler';
export { ApiSendErrorFunction } from './maestro/ApiSendErrorFunction';
export { ApiSendResponseFunction } from './maestro/ApiSendResponseFunction';
export { IApiMaestro } from './maestro/IApiMaestro';
export { MaestroRequestHandler as DefaultCallRouteResolver } from './maestro/default/RequestHandler';

// Proxy
export { IApiRequestProxy } from './proxy/IApiRequestProxy';
export { IApiResponseProxy } from './proxy/IApiResponseProxy';
export { IProxiedApiRoute } from './proxy/IProxiedApiRoute';

// Request
export { ApiRouteRequest } from './request/ApiRouteRequest';
export { IApiRouteRequest } from './request/IApiRouteRequest';

// Response
export { IApiRouteResponse, implementsApiRouteResponse } from './response/IApiRouteResponse';
export { ApiRouteResponse } from './response/ApiRouteResponse';

// Route
export { ApiRouteResolver } from './route/ApiRouteResolver';
export { HTTPMethod } from './route/HTTPMethod';
export { IApiRoute } from './route/IApiRoute';
export { IRouteParameterSpecification } from './route/IRouteParameterSpecification';
export { RouteParameter } from './route/RouteParameter';
