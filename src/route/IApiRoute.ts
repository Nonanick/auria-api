import { RouteParameter } from './RouteParameter';
import { ParameterSchemaPolicy } from './ParameterSchemaPolicy';
import { OptionalParameterValidationPolicy } from './OptionalParameterValidationPolicy';
import { HTTPMethod } from './HTTPMethod';
import { ApiRouteResolver } from './ApiRouteResolver';

export interface IApiRoute {

  url: string;

  methods : HTTPMethod | HTTPMethod[];

  resolver : ApiRouteResolver;

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
  parameterSchemaPolicy?: ParameterSchemaPolicy;

  /**
   * Required Parameters
   * -------------------
   * Parameters that are necessary for the route, depending on the schema
   * policy ('none') the route MIGHT be called anyway when they are not passed! 
   */
  requiredParameters?: RouteParameter | RouteParameter[];

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
  optionalParametersValidationPolicy?: OptionalParameterValidationPolicy;

  /**
   * Optional Parameters
   * -------------------
   * Define parameters that are not essential to the route execution
   * but can change its behaviour when present, depending on schema policy
   * parameters not present in 'required' or 'optional' 
   */
  optionalParameters?: RouteParameter | RouteParameter[];
}