import { ApiControllerDefaultRouteConfig } from './controller/ApiControllerDefaultRouteConfig';
import { TestController } from './TestController';
import { IApiRouteRequest } from './request/IApiRouteRequest';
import { RegisterApiRoute } from './controller/RegisterApiRoute';

export class InheritController extends TestController {

  public get defaultRouteConfig () : ApiControllerDefaultRouteConfig  {
    return {
      optionalParametersValidationPolicy : "dont-validate"
    }
  };

  get baseURL(): string {
    return 'inh';
  }

  @RegisterApiRoute({
    url : 'new',
    methods : 'get'
  })
  public newRoute(req : IApiRouteRequest) {

  }
  
}