import { Handler } from "../../route/handler.type";
import { Controller } from "../../controller/controller.class";
import { Route } from "../../controller/route.decorator";

export class DiscoverApiController extends Controller {

  get baseURL(): string {
    return 'api';
  }

  @Route({
    url: '',
    methods: 'get'
  })
  loadClient: Handler = (req) => {
    req.get('maestro', 'discover').deleteCachedRoutes();
    return req.get('maestro', 'discover').allRoutes()
      .map(r => {
        return {
          ...r,
          requestProxies: r.requestProxies.filter(p => p.discoverable === true),
          responseProxies: r.responseProxies.filter(p => p.discoverable === true),
          validate: r.validate != null ? r.validate.toString() : undefined,
          controller: undefined,
          resolver: undefined,
        };
      });
  };


}