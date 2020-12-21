import { IRouteRequest } from '../request/IRouteRequest';
import { HTTPMethod } from "./HTTPMethod";
import { Resolver as RouteResolver } from "./Resolver";
import { RouteSchema } from './RouteSchema';
import { IValidateRoute } from './validation/IValidateRoute';

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
