import { Controller } from "../../controller/Controller";
import { Route } from "../../controller/RouteDecorator";
import { Maestro } from "../../maestro/Maestro";
import { RouteResponse } from "../../response/RouteResponse";
import { Resolver } from "../../route";

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
  public latest: Resolver = (req) => {

    const response = new RouteResponse(req);

    // Build JS file
    response.headers['content-type'] = 'application/javascript';

    response.payload = '';

    return response;
  }

}