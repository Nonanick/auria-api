import { IRoute } from '../route/IRoute';

/**
 * Default Route Configuration
 * ----------------------------
 * Type of the data structure expected 
 * to define the default APIRoute configuration
 * inside a ApiController
 * 
 */
export type ControllerDefaultRouteConfig = Pick<
  Partial<IRoute>,
  "enforceSchemaPolicy" | "schemaValidationPolicy"
>;