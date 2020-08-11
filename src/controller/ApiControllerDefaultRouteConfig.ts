import { IApiRoute } from '../route/IApiRoute';

/**
 * Default Route Configuration
 * ----------------------------
 * Type of the data structure expected 
 * to define the default APIRoute configuration
 * inside a ApiController
 * 
 */
export type ApiControllerDefaultRouteConfig = Pick<
Partial<IApiRoute>,
"parametersValidationPolicy" | "parameterSchemaPolicy" | "requiredParameters"
>;