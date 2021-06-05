import { IRouteRequest } from '../request/route_request.type';
import { HTTPMethod } from "./http_method.type";
import { Handler as RouteResolver } from "./handler.type";
import { RouteSchema } from './route_schema.type';
import { IValidateRoute } from './validation/validate_route.type';

export interface IRoute {
  url: string;

  /**
   * HTTP Methods
   * ------------
   */
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
   * Schema
   * -------
   * Define this api parameter schema 
   */
  schema?: RouteSchema;

  /**
   * Cast
   * -------
   * Apply casting to the request
   *
   */
  cast?: (request: IRouteRequest) => Promise<IRouteRequest>;

  /**
   * Validate
   * ---------
   * Apply a custom validation to the request
   */
  validate?: ((request: {
    [byOrigin: string]: {
      [name: string]: any;
    };
  }) => Promise<true | Error | Error[]>) | IValidateRoute | IValidateRoute[];

}
