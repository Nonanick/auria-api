import { ApiController } from './controller/ApiController';
import { RegisterApiRoute } from './controller/RegisterApiRoute';
import { ApiRouteRequest } from './request/ApiRouteRequest';
import { ApiControllerDefaultRouteConfig } from './controller/ApiControllerDefaultRouteConfig';

export class TestController extends ApiController {

  public get defaultRouteConfig () : ApiControllerDefaultRouteConfig  {
    return {
      optionalParametersValidationPolicy : "ignore-parameter"
    }
  };

  get baseURL(): string {
    return 'ctrl';
  }

  @RegisterApiRoute({
    url : 'route',
    methods : 'get',
  })
  public route(req : ApiRouteRequest) : void {
    console.log('After decorator?', this);
  };
  
}