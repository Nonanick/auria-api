import { Controller } from "../../controller/controller.class";
import { Route } from "../../controller/route.decorator";
import { Maestro } from "../../maestro/maestro.class";
import { RouteResponse } from "../../response/route_response.class";
import { Handler } from "../../route";

export class DiscoverClientController extends Controller {

  get baseURL(): string {
    return 'client';
  }

  protected routes: any[] = [];

  constructor(private server: Maestro) {
    super();

    this.server.started
      .then(_ => {
        this.routes = this.server.allRoutes();
      });
      
  }

  @Route({
    url: '',
    methods: 'get'
  })
  public latest: Handler = (req) => {

    const response = new RouteResponse(req);

    // Build JS file
    response.headers['content-type'] = 'application/javascript';

    response.payload = '';

    return response;
  }

}