import { HTTPMethod } from "./HTTPMethod";
import { Resolver as RouteResolver } from "./Resolver";
import { RouteSchema } from './RouteSchema';
import { EnforceSchemaPolicy } from '../validation/policies/schema/EnforceSchemaPolicy';
import { FailedPropertyValidationPolicy } from '../validation/policies/property/FailedPropertyValidationPolicy';
import { SchemaValidateFunction } from 'ajv';
import { IRouteRequest } from '../request/IRouteRequest';
import { MaybePromise } from '../error/Maybe';

export interface IRoute {
  url: string;

  methods: HTTPMethod | HTTPMethod[];

  /**
   * Resolver
   * --------
   * Function responsible for answering a request
   * Will generate either the *IApiRouteResponse* or
   * the payload for it! 
   * 
   * When resolver is a string it indicates that the function is
   * actually a property from the controller and should be
   * called when needed as an index:
   * @example controller[route.resolver]
   */
  resolver: RouteResolver | string;

  /**
   * Parameter Schema Policy
   * -----------------------
   * Indicate what behaviour should be applied
   * when dealing with received parameters:
   *
   * 1) Enforce Required, enforces required parameters to be present
   * otherwise route will be prevented from being accessed [DEFAULT]
   *
   * 2) Only in schema, make the route fail when a parameter is not present
   * in either 'required' or 'optional' parameters description [SAFEST]
   *
   * 3) None, does not enforce parameters to be present, does not
   * fail when an unkown parameter is passed [DISCOURAGED]
   *
   */
  enforceSchemaPolicy?: EnforceSchemaPolicy;

  /**
   * Optional Parameters Validation Policy
   * -------------------------------------
   * Indicates what behaviour should be adopted when validating
   * optional parameters:
   *
   * 1) Prevent Execution, will prevent the route from being accesses when an optional
   * parameter validation fails [DEFAULT]
   *
   * 2) Ignore Parameter, will delete parameter from request when validation fails
   *
   * 3) Don't validate, will not apply validate function on parameter, sanitizers will
   * apply regardless!
   */
  schemaValidationPolicy?: FailedPropertyValidationPolicy;

  /**
   * Schema
   * -------
   * Define this api parameter schema 
   */
  schema?: RouteSchema;

  compiledSchema?: (request: IRouteRequest) => MaybePromise<true>;

  cast?: (request: IRouteRequest) => Promise<IRouteRequest>;

}
